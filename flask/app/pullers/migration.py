from turtle import update
from app import db
import os
import traceback
from netmiko import Netmiko
import sys
from numpy import std
import paramiko
import textfsm
import time
from app.models.poc import CPE_TABLE, PHONE_LINES, POST_CPE_TABLE
from datetime import datetime
class Migration(object):
    def __init__(self):
        self.connections_limit = 50
        self.failed_devices=[]
    
    def InsertData(self, obj):
        #add data to db
        db.session.add(obj)
        db.session.commit()
        return True
    
    def FormatStringDate(self, date):
        print(date, file=sys.stderr)

        try:
            if date is not None:
                if '-' in date:
                    result = datetime.strptime(date,'%d-%m-%Y')
                elif '/' in date:
                    result = datetime.strptime(date,'%d/%m/%Y')
                else:
                    print("incorrect date format", file=sys.stderr)
                    result = datetime(2000, 1, 1)
            else:
                #result = datetime(2000, 1, 1)
                result = datetime(2000, 1, 1)
        except:
            result=datetime(2000, 1,1)
            print("date format exception", file=sys.stderr)

        return result

    def FormatDate(self, date):
    #print(date, file=sys.stderr)
        if date is not None:
            result = date.strftime('%d-%m-%Y')
        else:
            #result = datetime(2000, 1, 1)
            result = datetime(1, 1, 2000)

        return result

    def UpdateData(self, obj):
        #add data to db
        #print(obj, file=sys.stderr)
        #print(f"DB OBJ {obj.migration_status}.", file=sys.stderr)
        try:
            db.session.flush()
            db.session.merge(obj)
            db.session.commit()
            

        except Exception as e:
            db.session.rollback()
            print(f"Something else went wrong during Database Update {e}", file=sys.stderr)
        
    def addCpeToDB(self, cpe):
        cpeDB = CPE_TABLE()
        try:
            cpeDB.cpe_ip_address = cpe.get('cpe_ip')
            cpeDB.cpe_username = cpe.get('cpe_username')
            cpeDB.cpe_password = cpe.get('cpe_password')
            if 'model' in cpe.get('checked_values'):
                cpeDB.model_number = cpe.get('model_number')
            if 'serial' in cpe.get('checked_values'):
                cpeDB.serial_number = cpe.get('serial_number')
            if 'mac_address' in cpe.get('checked_values'):
                cpeDB.mac_address = cpe.get('mac_address','')
            cpeDB.firmware = cpe.get('firmware','')
            cpeDB.outbound_ip = cpe.get('outbound_ip','')
            cpeDB.listening_port = cpe.get('listening_port','')
            cpeDB.acs_url = cpe.get('acs_url','')
            cpeDB.cwmp_annex = cpe.get('cwmp_annex','')
            cpeDB.cwmp_user_name = cpe.get('cwmp_user_name','')
            cpeDB.cwmp_password = cpe.get('cwmp_password','')
            cpeDB.cwmp_periodic_info = cpe.get('cwmp_periodic_info','')
                                    
            phoneLineOb= CPE_TABLE.query.with_entities(CPE_TABLE).filter_by(cpe_ip_address=cpe.get('cpe_ip')).first()
            if phoneLineOb:
                self.UpdateData(cpeDB)
                print("Updated SEP", file=sys.stderr)
            else:
                self.InsertData(cpeDB)
                print("Inserted SEP", file=sys.stderr)
            print('Successfully added Phone to the Database',file = sys.stderr)        
        except Exception as e:
            db.session.rollback()
            print(f"Error while inserting data into DB {e}", file=sys.stderr)
            traceback.print_exc()

    def addPhoneLineToDB(self, cpe_ip, phoneLines, checked_values):
        for phone in phoneLines:
            phonesDB = PHONE_LINES()
            try:
                if 'phone_line_info' in checked_values:
                    phonesDB.cpe_ip_address = cpe_ip
                    phonesDB.user_name = phone.get('user_name')
                    if 'client_credientials' in checked_values:
                        phonesDB.password = phone.get('password')
                    phonesDB.registration_status = phone.get('state','')
                    phonesDB.pre_migration_status = phone.get('state','')
                    phonesDB.migration_status= "Null"
                    
                    phoneObj= PHONE_LINES.query.with_entities(PHONE_LINES).filter_by(cpe_ip_address=cpe_ip).filter_by(user_name=phone.get('user_name')).first()
                    if phoneObj:
                        phonesDB.phone_lines_id= phoneObj.phone_lines_id   
                        self.UpdateData(phonesDB)
                        print("Updated Phone Line", file=sys.stderr)
                    else:
                        self.InsertData(phonesDB)
                        print("Inserted Phone Line", file=sys.stderr)
            
                    print('Successfully added Phone to the Database',file = sys.stderr)
            
            except Exception as e:
                db.session.rollback()
                print(f"Error while inserting data into DB {e}", file=sys.stderr)
    
    def addMigrationDataToDB(self, cp):

        phoneObj= PHONE_LINES.query.with_entities(PHONE_LINES).filter_by(cpe_ip_address=cp['ip']).all()
        if phoneObj:
            for phone in phoneObj:
                try:
                    phone.phone_lines_id = phone.phone_lines_id
                    phone.migration_status = "Migrating"
                    phone.status_update_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    self.UpdateData(phone)
                    print("Updated Migration Information of CPS", file=sys.stderr)
                except Exception as e:
                        db.session.rollback()
                        print(f"Error while Updating Migration Data data into DB {e}", file=sys.stderr)
        else:
            print("No Phone Lines Found", file=sys.stderr)

    def login(self, host, login_type):
        device=""
        print(f"Connecting to {host['ip']}", file=sys.stderr)
        login_tries = 3
        is_login = False
        retry=0
        if login_type== 'netmiko':
            while retry < login_tries :
                try:
                    device = Netmiko(host=host['ip'], username=host['user_name'], password=host['password'], device_type=host['sw_type'], timeout=600, global_delay_factor=2)
                    print(f"Success: logged in {host['ip']}", file=sys.stderr)
                    is_login = True
                    break
                except Exception as e:
                    retry+=1
                    print(f"Exception occured in device login {e}", file=sys.stderr)
        
        if login_type=='paramiko': 
            while(retry<login_tries):
                try:
                    device = paramiko.SSHClient()
                    device.set_missing_host_key_policy(paramiko.AutoAddPolicy())
                    device.connect(host['ip'], port=22, username=host['user_name'], password=host['password'], timeout=30)
                    print('Connected to: ', file=sys.stderr)
                    is_login = True
                    stdin, stdout, stderr = device.exec_command('sipEp.registrationstatus')
                    
                    for line in iter(stdout.readline, ""):
                        systemInfo+= line
                    #systemInfo= self.parseParamikoOutput(output)
                    print(systemInfo, file=sys.stderr)

                    break
                except Exception as e:
                    retry+=1
                    print(f"Exception occured in device login {e}", file=sys.stderr)
                           
        return is_login, device

    def parseParamikoOutput(self, stdout):
        result=""
        for line in iter(stdout):
            result+= line
        return result
    
    def parseTexfsm(self, input, template_path):
        fsm_result=[]
        try:
            template = open(template_path)
            re_table = textfsm.TextFSM(template)
            fsm_result = re_table.ParseText(input)
        except Exception as e:
            print(f"Can not Parse Textfsm {e}", file=sys.stderr)
        return fsm_result

    def preMigration(self, host):
        print(f"Logging in to Device {host['ip']}", file=sys.stderr)
        is_login, device= self.login(host, 'netmiko')         
        
        if is_login==False:
            cpe={}
            cpe['cpe_ip']= host['ip']
            cpe['cpe_username']= host['user_name']
            cpe['cpe_password']= host['password']
            cpe['checked_values']= host['checked_values']
            cpe['model_number']= "Access Issue"
            cpe['serial_number']= "Access Issue"
            cpe['mac_address']= "Access Issue"
            cpe['firmware']= "Access Issue"
            cpe['outbound_ip']= "Access Issue"
            cpe['listening_port']= "Access Issue"
            cpe['acs_url']= "Access Issue"
            cpe['cwmp_user_name']= "Access Issue"
            cpe['cwmp_password']= "Access Issue"
            cpe['cwmp_annex']= "Access Issue"
            cpe['cwmp_periodic_info']= "Access Issue"

            self.addCpeToDB(cpe)
            print(f"Failed to login {host['ip']}", file=sys.stderr)
                  
        if is_login==True:    
            print(f"Successfully Logged into device {host['ip']}", file=sys.stderr) 
            phones=[]
            cpe={}                       
            try:
                systemInfo = device.send_command('sysinfo', textfsm_template="app/textfsms/mediatriax_sysinfo.textfsm", use_textfsm=True)
                print(systemInfo, file=sys.stderr)

                registrationStatus = device.send_command('sipEp.registrationstatus', textfsm_template="app/textfsms/mediatriax_registration_status.textfsm", use_textfsm=True)
                print(registrationStatus, file=sys.stderr)

                phonesPassword = device.send_command('sipEp.authentication', textfsm_template="app/textfsms/mediatriax_authentication_password.textfsm", use_textfsm=True)
                print(phonesPassword, file=sys.stderr)

                sipIP = device.send_command('SipEp.DefaultStaticProxyOutboundHost')
                print(sipIP, file=sys.stderr)
                
                listeningPort = device.send_command('cwmp.listeningPort')
                print(listeningPort, file=sys.stderr)

                acsUrl = device.send_command('cwmp.acsurl')
                print(acsUrl, file=sys.stderr)
                
                cwmpUsername = device.send_command('cwmp.username')
                print(cwmpUsername, file=sys.stderr)

                cwmpPassword = device.send_command('cwmp.password')
                print(cwmpPassword, file=sys.stderr)

                cwmpAnnex = device.send_command('cwmp.tr069AnnexFEnable')
                print(cwmpAnnex, file=sys.stderr)
                
                cwmpPeriodicInfo = device.send_command('cwmp.periodicInformenable')
                print(cwmpPeriodicInfo, file=sys.stderr)
                
                # Parse Data
                #cpe
                cpe['cpe_ip']= host['ip']
                cpe['cpe_username']= host['user_name']
                cpe['cpe_password']= host['password']
                cpe['checked_values']= host['checked_values']
                cpe['model_number']= systemInfo[0].get('description','')
                cpe['serial_number']= systemInfo[0].get('serial_number','')
                cpe['mac_address']= systemInfo[0].get('mac_address','')
                cpe['firmware']= systemInfo[0].get('firmware','')
                cpe['outbound_ip']= sipIP
                cpe['listening_port']= listeningPort
                cpe['acs_url']= acsUrl
                cpe['cwmp_user_name']= cwmpUsername
                cpe['cwmp_password']= cwmpPassword
                cpe['cwmp_annex']= cwmpAnnex
                cpe['cwmp_periodic_info']= cwmpPeriodicInfo

                #phone lines
                for phone in registrationStatus:
                    tempPhone={}
                    tempPhone['index']= phone['index'].strip()
                    tempPhone['user_name']= phone['user_name'].strip()
                    tempPhone['state']= phone['state'].strip()
                    if isinstance(phonesPassword, list):
                        matched_phones =list(filter(lambda index: index['index'] == phone['index'], phonesPassword))
                        if matched_phones:
                            tempPhone['password']= matched_phones[0]['password'].strip()
                    phones.append(tempPhone) 
                print(f"Phones are: {phones}", file=sys.stderr)
                               
                #Insert to DB
                self.addCpeToDB(cpe)
                self.addPhoneLineToDB(host['ip'],phones, host['checked_values'])
                print("Closing Connection", file=sys.stderr)
            except Exception as e:
                
                print(f"Exception Occured {e}", file=sys.stderr)
                print(f"Exception Occured when fetching phones {host['ip']}, {str(e)}", file=sys.stderr)
                traceback.print_exc()
                device.disconnect()
                return 500
            device.disconnect()
            return 200
    
    def migration(self, cpe):
        is_login, device= self.login(cpe, 'netmiko')         

        if is_login==False:
            print(f"Failed to login {cpe['ip']}", file=sys.stderr)
                  
        if is_login==True:    
            print(f"Successfully Logged into device {cpe['ip']}", file=sys.stderr) 
            phones=[]                       
            try:
                if cpe['ip_to_fqdn']:
                    device.send_command(f"SipEp.DefaultStaticProxyOutboundHost={cpe['ip_to_fqdn']}") ###
                else:
                    device.send_command("SipEp.DefaultStaticProxyOutboundHost=fixedimsmey.duvoip.fmc") ###
            
                device.send_command("Cwmp.PeriodiclnformEnable =Enable")
                device.send_command("Cwmp.Tr069AnnexFEnable= Enable")
                
                if cpe['listening_port']:
                    device.send_command(f"Cwmp.ListeningPort = {cpe['listening_port']}") ##
                else:
                    device.send_command("Cwmp.ListeningPort=30005") ##
                
                device.send_command("Cwmp.AcsStaticUrl=http://172.21.138.20/cwmpWeb/WGCPEMgt")
                device.send_command("Cwmp.Username=hdm_cpe")
                device.send_command("Cwmp.Password=hdm_cpe_p")
                device.send_command("scm.restartrequiredservices") 
                self.addMigrationDataToDB(cpe)

                
            except Exception as e:
                print(f"Exception Occured {e}", file=sys.stderr)
                print(f"Exception Occured during Migration {cpe['ip']}, {str(e)}", file=sys.stderr)
                traceback.print_exc()
            device.disconnect()
           
    
'''
obj= Migration()
host={}
host['ip']= '10.17.210.213'
host['user_name']= 'DuAdmin'
host['password']= 'ENRTeam123'
host['sw_type']= 'cisco_ios'
#obj.preMigration(host)
#obj.migration(host)
obj.rollBack(host)
'''