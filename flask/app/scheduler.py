from re import M
import traceback
from turtle import update
import time
from numpy import logical_and
#from zmq import device
from flask_apscheduler import APScheduler
from app import app, db
from datetime import datetime
import sys
from app.models.poc import CPE_TABLE, PHONE_LINES, POST_CPE_TABLE
from app.pullers.migration import Migration
from netmiko import Netmiko

#######scheduler intialiation
scheduler = APScheduler()
scheduler.api_enabled = True
scheduler.init_app(app)
scheduler.start()
print("Scheduler Registered", file=sys.stderr)

def getPhonesInMigration():
    phoneObjs= PHONE_LINES.query.with_entities(PHONE_LINES).filter_by(migration_status='Migrating').all()
    db.session.rollback()
    print(f"@@@ {phoneObjs}", file=sys.stderr)
    return phoneObjs
@scheduler.task('interval', id='MonitorMigrations', minutes=1)
def MonitorMigrations():
   
    try:
        print('Monitoring Migration', file=sys.stderr)
        #Get all phone lines
        phoneObjs= getPhonesInMigration()
        if phoneObjs:
            for phone in phoneObjs:
                current_time= datetime.now()
                migrationTimeDifference= current_time- phone.status_update_time
                migrationTimeDifference = migrationTimeDifference.total_seconds()
                print(f" $$$ Duration of Time is: {migrationTimeDifference}", file=sys.stderr)
                latestStatus= PHONE_LINES.query.with_entities(PHONE_LINES.migration_status).filter_by(phone_lines_id=phone.phone_lines_id).first()
                if latestStatus.migration_status == "Rolled Back" or latestStatus.migration_status == "Rolled Back Failed" or migrationTimeDifference<60:
                    print(f"Skipping Phone Migration Update CPE ID {phone.cpe_ip_address} User {phone.user_name}", file=sys.stderr)
                    continue
                pre_migration_status= phone.pre_migration_status
                cpeObj= CPE_TABLE.query.with_entities(CPE_TABLE).filter_by(cpe_ip_address=phone.cpe_ip_address).first()
                post_migration_status= getMigrationStatusofPhoneLine(cpeObj, phone.user_name)
                
                print(f"Pre Migration Status of Phone User {phone.user_name} CP {cpeObj.cpe_ip_address} is {phone.pre_migration_status}", file=sys.stderr)
                print(f"Post Migration Status of Phone User {phone.user_name} CP {cpeObj.cpe_ip_address} is {post_migration_status}", file=sys.stderr)
                
                if 'registered' in post_migration_status.lower():
                    print(f" ******** Successfully Migrated Phone Line CPE {phone.cpe_ip_address} User {phone.user_name}", file=sys.stderr)
                    phone.migration_status= "Successfully Migrated"
                    phone.registration_status= post_migration_status
                    UpdateData(phone)
                    
                    #Restarting CPE
                    #restartCpe(cpeObj)
                else:
                    if 'registered' not in pre_migration_status.lower():
                        print(f" %%%%%%%%%%%% Phoneline is Not Registered also Not registered previously CPE {phone.cpe_ip_address} User {phone.user_name}", file=sys.stderr)
                        phone.migration_status= "Migration Completed"
                        phone.registration_status= post_migration_status
                        UpdateData(phone)
                    else: 
                        print(f" ############ Rolling Back  CPE {phone.cpe_ip_address} User {phone.user_name}", file=sys.stderr)
                        
                        status= rollBackCpe(cpeObj)
                        #time.sleep(10)
                        
                        migration_status=""
                        if status==200:
                            migration_status= "Rolled Back"
                        else:
                            migration_status= "Rolled Back Failed"
                        
                        phoneLines= PHONE_LINES.query.with_entities(PHONE_LINES).filter_by(cpe_ip_address=phone.cpe_ip_address).all()
                        for phoneLine in phoneLines:
                            #post_migration_status= getMigrationStatusofPhoneLine(cpeObj, phoneLine.user_name)
                            phoneLine.registration_status= post_migration_status
                            phoneLine.migration_status= migration_status
                            UpdateData(phoneLine)

                print("Updating Post Migration Data")
                updatePostMigrationCPE(cpeObj)           
        #else:
        #    print("N pjone foiffff", file=sys.stderr)   
        #    phoneObjs= PHONE_LINES.query.with_entities(PHONE_LINES).all()             
        #    for p in phoneObjs:
        #        print(f"### {p.migration_status}", file=sys.stderr)
                        # if status==200:
                        #     phone.migration_status= "Rolled Back"
                        # else:
                        #     phone.registration_status= "Roll Back Failed"

                        # UpdateData(phone)
                        # db.session.execute(f"update phone_lines set MIGRATION_STATUS={phone.migration_status=} where CPE_IP_ADDRESS='{phone.cpe_ip_address}';")
                        # db.session.commit()

        phoneObjs=""    
        
        print(f"Scheduler Finished", file=sys.stderr)

    except Exception as e:
        traceback.print_exc()
        print(f"Exception Occured in Scheduler {e}", file=sys.stderr)

def login(cpObj):
    
    login_tries = 3
    is_login = False
    retry=0
    while retry < login_tries :
        try:
            device = Netmiko(host=cpObj.cpe_ip_address, username=cpObj.cpe_username, password=cpObj.cpe_password, device_type='cisco_ios', timeout=600, global_delay_factor=2)
            print(f"Success: logged in {cpObj.cpe_ip_address}", file=sys.stderr)
            is_login = True
            return is_login, device
        except Exception as e:
            retry+=1
            print(f"Exception occured in device login {e}", file=sys.stderr)

    
def getMigrationStatusofPhoneLine(cpObj, phoneUser):
    print(f"Connecting to {cpObj.cpe_ip_address}", file=sys.stderr)
    device=""
    is_login, device= login(cpObj)
    if is_login==False:
        print(f"Failed to login {cpObj.cpe_ip_address}", file=sys.stderr)
                
    if is_login==True:    
        print(f"Successfully Logged into device {cpObj.cpe_ip_address}", file=sys.stderr) 
        status=""          
        try:
            registrationStatus = device.send_command('sipEp.registrationstatus', textfsm_template="app/textfsms/mediatriax_registration_status.textfsm", use_textfsm=True)
            for phone in registrationStatus:
                print(phone['user_name'], file=sys.stderr)
                print(phone['user_name'].strip(), file=sys.stderr)
                if phone['user_name'].strip()== phoneUser.strip():

                    status= phone['state']
                    break      
        except Exception as e:
                
                print(f"Exception Occured {e}", file=sys.stderr)
                print(f"Exception Occured when fetching phones status from scheduler {cpObj.cpe_ip_address}, {str(e)}", file=sys.stderr)
        device.disconnect()
        return status    

def UpdateData(obj):
        #add data to db
        #print(obj, file=sys.stderr)
        try:
            db.session.flush()
            db.session.merge(obj)
            db.session.commit()

        except Exception as e:
            db.session.rollback()
            print(f"Something else went wrong during Database Update {e}", file=sys.stderr)
    
def rollBackCpe(cpObj):
    print(f"Connecting to {cpObj.cpe_ip_address}", file=sys.stderr)
    is_login, device= login(cpObj)   
    if is_login==False:
        print(f"Failed to login {cpObj.cpe_ip_address}", file=sys.stderr)
        return 500       

    if is_login==True:    
        print(f"Successfully Logged into device {cpObj.cpe_ip_address}", file=sys.stderr)                      
        try:       
            device.send_command(f"SipEp.DefaultStaticProxyOutboundHost={cpObj.outbound_ip}")   #("SipEp.DefaultStaticProxyOutboundHost = 10.44.109.6")
            device.send_command(f"Cwmp.PeriodiclnformEnable{cpObj.cwmp_periodic_info}")  #("Cwmp.PeriodiclnformEnable =Enable")
            device.send_command(f"Cwmp.Tr069AnnexFEnable={cpObj.cwmp_annex}")   #("Cwmp.Tr069AnnexFEnable= Enable")
            device.send_command(f"Cwmp.ListeningPort={cpObj.listening_port}")            #("Cwmp.ListeningPort = 0")
            device.send_command(f"Cwmp.AcsStaticUrl={cpObj.acs_url}")  #("Cwmp.AcsStaticUrl = http://172.21.138.20/cwmpWeb/WGCPEMgt")
            device.send_command(f"Cwmp.Username={cpObj.cwmp_user_name}") #("Cwmp.Username = hdm_cpe")
            device.send_command(f"Cwmp.Password={cpObj.cwmp_password}") #("Cwmp.Username = hdm_cpe")
            device.send_command("scm.restartrequiredservices")            
               
        except Exception as e:
            print(f"Exception Occured {e}", file=sys.stderr)
            print(f"Exception Occured during RollBack {cpObj.cpe_ip_address}, {str(e)}", file=sys.stderr)
            traceback.print_exc()
            device.disconnect()
            return 500      
    device.disconnect()
    return 200

def restartCpe(cpObj):
    print(f"Connecting to {cpObj.cpe_ip_address}", file=sys.stderr)
    is_login, device= login(cpObj)   
    if is_login==False:
        print(f"Failed to login {cpObj.cpe_ip_address}", file=sys.stderr)
        return 500       
    if is_login==True:    
        print(f"Successfully Logged into device {cpObj.cpe_ip_address}", file=sys.stderr)

        device.send_command("scm.restartrequiredservices")   
        device.disconnect()

    
def addPostCpeToDB(cpe):
    postCpeDB = POST_CPE_TABLE()
    try:
        postCpeDB.cpe_ip_address = cpe.get('cpe_ip')
        postCpeDB.cpe_username = cpe.get('cpe_username')
        postCpeDB.cpe_password = cpe.get('cpe_password')
        postCpeDB.model_number = cpe.get('model_number')
        postCpeDB.serial_number = cpe.get('serial_number')
        postCpeDB.mac_address = cpe.get('mac_address','')
        postCpeDB.firmware = cpe.get('firmware','')
        postCpeDB.outbound_ip = cpe.get('outbound_ip','')
        postCpeDB.listening_port = cpe.get('listening_port','')
        postCpeDB.acs_url = cpe.get('acs_url','')
        postCpeDB.cwmp_annex = cpe.get('cwmp_annex','')
        postCpeDB.cwmp_user_name = cpe.get('cwmp_user_name','')
        postCpeDB.cwmp_password = cpe.get('cwmp_password','')
        postCpeDB.cwmp_periodic_info = cpe.get('cwmp_periodic_info','')
                                
        phoneLineOb= POST_CPE_TABLE.query.with_entities(POST_CPE_TABLE).filter_by(cpe_ip_address=cpe.get('cpe_ip')).first()
        if phoneLineOb:
            UpdateData(postCpeDB)
            print("Updated SEP", file=sys.stderr)
        else:
            InsertData(postCpeDB)
            print("Inserted SEP", file=sys.stderr)
        print('Successfully added Phone to the Database',file = sys.stderr)        
    except Exception as e:
        db.session.rollback()
        print(f"Error while inserting data into DB {e}", file=sys.stderr)
        traceback.print_exc()

def InsertData(obj):
    #add data to db
    try:        
        db.session.add(obj)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(f"Something else went wrong in Database Insertion {e}", file=sys.stderr)

    return True

def updatePostMigrationCPE(cpsObj):
    #cpsObjs= CPE_TABLE.query.with_entities(CPE_TABLE).all()
    is_login, device= login(cpsObj) 

    if is_login==False:
        print(f"Failed to login {cpsObj.cpe_ip_address}", file=sys.stderr)
                
    if is_login==True:    
        print(f"Successfully Logged into device {cpsObj.cpe_ip_address}", file=sys.stderr) 
        postCpe={}
        postCpe["cpe_ip"]= cpsObj.cpe_ip_address                   
        try:
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

            
            print(f"CPES object in post cpe update iis {cpsObj}", file=sys.stderr)
            postCpe['cpe_username']= cpsObj.cpe_username
            postCpe['cpe_password']= cpsObj.cpe_password
            postCpe['model_number']= cpsObj.model_number
            postCpe['serial_number']= cpsObj.serial_number
            postCpe['mac_address']= cpsObj.mac_address
            postCpe['firmware']= cpsObj.firmware
            postCpe['cwmp_annex']= cpsObj.cwmp_annex
            postCpe['cwmp_periodic_info']= cpsObj.cwmp_periodic_info
            postCpe['outbound_ip']= sipIP
            postCpe['listening_port']= listeningPort
            postCpe['acs_url']= acsUrl
            postCpe['cwmp_user_name']= cwmpUsername
            postCpe['cwmp_password']= cwmpPassword
            addPostCpeToDB(postCpe)
        except Exception as e:     
            print(f"Exception Occured {e}", file=sys.stderr)
            print(f"Exception Occured when fetching phones {cpsObj.cpe_ip_address}, {str(e)}", file=sys.stderr)
            traceback.print_exc()
            device.disconnect()
        device.disconnect()
