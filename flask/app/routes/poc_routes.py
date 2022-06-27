import gzip
import json
import time
from tkinter import PhotoImage
from app import app,db
from flask_jsonpify import jsonify
from flask import request, make_response, Response, session
import sys
from app.pullers.migration import Migration
from app.models.poc import CPE_TABLE, PHONE_LINES,POST_CPE_TABLE
import threading

def InsertData(obj):
    #add data to db
    try:        
        db.session.add(obj)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(f"Something else went wrong in Database Insertion {e}", file=sys.stderr)

    return True

@app.route("/")
def hello():
    return "Welcome to DU Migration Solution"

#@app.route("/addCpe", methods = ['GET'])
@app.route("/addCpe", methods = ['POST'])
def AddCpe():
    if True:#request.headers.get('X-Auth-Key') == session.get('token', None):
        cpeData = request.get_json()
        print(cpeData,file=sys.stderr)
        #ccpData={'ip_address': '3005', 'user_name': 'www.test.com', 'password':'password', 'checked_values':['']}
            
        try:
            host={}
            host['ip']= cpeData["ip_address"]
            host['user_name']= cpeData["user_name"]
            host['password']= cpeData['password']
            #host['checked_values']= cpeData['checked_values']
            host['sw_type']= 'cisco_ios'
            host['checked_values']=[
                "model",
                "serial",
                "mac_address",
                "phone_line_info",
                "client_credientials"
              ]
            pocObj= Migration()
            status= pocObj.preMigration(host)
            if status==200:
                return jsonify({'response': "CPE successfully added to DB","code":"200"})
            else:
                return jsonify({'response': "Failed to ADD CPE Device"}), 500  

        except Exception as e: 
            print(f"Failed to ADD CPE Device {e}", file=sys.stderr)
            return jsonify({'response': "Failed to ADD CPE Device"}), 500  
@app.route("/addCpes",methods=['POST'])
def AddCpes():
    if True:
        connections_limit=70
        cpeData = request.get_json()
        print(cpeData,file=sys.stderr)
        try:
            threads =[]

            for cpeObj in cpeData:
                print((cpeObj),file=sys.stderr)
                host = {}
                host['ip']=cpeObj['cpe_ip_address']
                host['user_name']=cpeObj['cpe_username']
                host['password']=cpeObj['cpe_password']
                host['checked_values']=[
                "model",
                "serial",
                "mac_address",
                "phone_line_info",
                "client_credientials"
              ]
                host['sw_type']='cisco_ios'
                pocObj = Migration()
                #status = pocObj.preMigration(host)
                
                th = threading.Thread(target=pocObj.preMigration, args=(host,))
                th.start()
                threads.append(th)
                if len(threads) == connections_limit: 
                    for t in threads:
                        t.join()
                    threads =[]
            else:
                for t in threads: # if request is less than connections_limit then join the threads and then return data
                    t.join()

                # if status==200:
                #     return jsonify({'response': "CPE successfully added to DB","code":"200"})
                # else:
                #     return jsonify({'response': "Failed to ADD CPE Device"}), 500  
            return jsonify({"STATUS":"OK"})
        except Exception as e: 
            print(f"Failed to ADD CPE Device {e}", file=sys.stderr)
            return jsonify({'response': "Failed to ADD CPE Device"}), 500
def hello_world(test):
    print("TESTINGGGG", file=sys.stderr)
    time.sleep(50)
    print("Finished", file=sys.stderr)

'''
@app.route("/addCpes",methods=['POST'])
def AddCpes():
    if True:
        cpeData = request.get_json()
        print(cpeData,file=sys.stderr)
        try:
            for cpeObj in cpeData:
                print((cpeObj),file=sys.stderr)
                host = {}
                host['ip']=cpeObj['cpe_ip_address']
                host['user_name']=cpeObj['cpe_username']
                host['password']=cpeObj['cpe_password']
                host['checked_values']=[
                "model",
                "serial",
                "mac_address",
                "phone_line_info",
                "client_credientials"
              ]
                host['sw_type']='cisco_ios'
                pocObj = Migration()
                status = pocObj.preMigration(host)
                # if status==200:
                #     return jsonify({'response': "CPE successfully added to DB","code":"200"})
                # else:
                #     return jsonify({'response': "Failed to ADD CPE Device"}), 500  
            return jsonify({"STATUS":"OK"})
        except Exception as e: 
            print(f"Failed to ADD CPE Device {e}", file=sys.stderr)
            return jsonify({'response': "Failed to ADD CPE Device"}), 500

'''
        

@app.route("/exportPreCpes",methods=['GET'])
def ExportPreCpes():
    if True:
        preCpeObjList = []
        preCpeObjs = CPE_TABLE.query.all()
        

        for preCpeObj in preCpeObjs:
            preCpeDataDict = {}
            
            preCpeDataDict['cpe_ip_address']=preCpeObj.cpe_ip_address
            # preCpeDataDict['cpe_username']=preCpeObj.cpe_username
            # preCpeDataDict['cpe_password']=preCpeObj.cpe_password
            preCpeDataDict['model_number']=preCpeObj.model_number
            preCpeDataDict['serial_number']=preCpeObj.serial_number
            preCpeDataDict['mac_address']=preCpeObj.mac_address
            preCpeDataDict['firmware']=preCpeObj.firmware
            preCpeDataDict['outbound_ip']=preCpeObj.outbound_ip
            preCpeDataDict['listening_port']=preCpeObj.listening_port
            preCpeDataDict['acs_url']=preCpeObj.acs_url
            preCpeDataDict['cwmp_user_name']=preCpeObj.cwmp_user_name
            preCpeDataDict['cwmp_password']=preCpeObj.cwmp_password
            preCpeObjList.append(preCpeDataDict)
            
            phoneObjs = PHONE_LINES.query.filter_by(cpe_ip_address=preCpeObj.cpe_ip_address)
            if phoneObjs:

                for phoneObj in phoneObjs:
                    phoneLinesDataDict = {}
                    phoneLinesDataDict['user_name']=phoneObj.user_name
                    phoneLinesDataDict['password']=phoneObj.password
                    phoneLinesDataDict['pre_migration_status']=phoneObj.pre_migration_status
                    phoneLinesDataDict['cpe_ip_address']=preCpeObj.cpe_ip_address
                    # phoneLinesDataDict['cpe_username']=preCpeObj.cpe_username
                    # phoneLinesDataDict['cpe_password']=preCpeObj.cpe_password
                    phoneLinesDataDict['model_number']=preCpeObj.model_number
                    phoneLinesDataDict['serial_number']=preCpeObj.serial_number
                    phoneLinesDataDict['mac_address']=preCpeObj.mac_address
                    phoneLinesDataDict['firmware']=preCpeObj.firmware
                    phoneLinesDataDict['outbound_ip']=preCpeObj.outbound_ip
                    phoneLinesDataDict['listening_port']=preCpeObj.listening_port
                    phoneLinesDataDict['acs_url']=preCpeObj.acs_url
                    phoneLinesDataDict['cwmp_user_name']=preCpeObj.cwmp_user_name
                    phoneLinesDataDict['cwmp_password']=preCpeObj.cwmp_password
                    preCpeObjList.append(phoneLinesDataDict)
        data = json.dumps(preCpeObjList, sort_keys=False)
                    
        print(preCpeObjList)
        
        return (data),200
    
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401
@app.route("/exportPostCpes",methods=['GET'])
def ExportPostCpes():
    if True:
        postCpeObjList = []
        postCpeObjs = POST_CPE_TABLE.query.all()
        

        for postCpeObj in postCpeObjs:
            postCpeDataDict = {}
            
            postCpeDataDict['cpe_ip_address']=postCpeObj.cpe_ip_address
            # postCpeDataDict['cpe_username']=postCpeObj.cpe_username
            # postCpeDataDict['cpe_password']=postCpeObj.cpe_password
            postCpeDataDict['model_number']=postCpeObj.model_number
            postCpeDataDict['serial_number']=postCpeObj.serial_number
            postCpeDataDict['mac_address']=postCpeObj.mac_address
            postCpeDataDict['firmware']=postCpeObj.firmware
            postCpeDataDict['outbound_ip']=postCpeObj.outbound_ip
            postCpeDataDict['listening_port']=postCpeObj.listening_port
            postCpeDataDict['acs_url']=postCpeObj.acs_url
            postCpeDataDict['cwmp_user_name']=postCpeObj.cwmp_user_name
            postCpeDataDict['cwmp_password']=postCpeObj.cwmp_password
            postCpeObjList.append(postCpeDataDict)
            
            phoneObjs = PHONE_LINES.query.filter_by(cpe_ip_address=postCpeObj.cpe_ip_address)
            if phoneObjs:

                for phoneObj in phoneObjs:
                    phoneLinesDataDict = {}
                    phoneLinesDataDict['user_name']=phoneObj.user_name
                    phoneLinesDataDict['password']=phoneObj.password
                    phoneLinesDataDict['migration_status']=phoneObj.migration_status
                    phoneLinesDataDict['registration_status']=phoneObj.registration_status
                    phoneLinesDataDict['pre_migration_status']=phoneObj.pre_migration_status
                    phoneLinesDataDict['cpe_ip_address']=postCpeObj.cpe_ip_address
                    # phoneLinesDataDict['cpe_username']=postCpeObj.cpe_username
                    # phoneLinesDataDict['cpe_password']=postCpeObj.cpe_password
                    phoneLinesDataDict['model_number']=postCpeObj.model_number
                    phoneLinesDataDict['serial_number']=postCpeObj.serial_number
                    phoneLinesDataDict['mac_address']=postCpeObj.mac_address
                    phoneLinesDataDict['firmware']=postCpeObj.firmware
                    phoneLinesDataDict['outbound_ip']=postCpeObj.outbound_ip
                    phoneLinesDataDict['listening_port']=postCpeObj.listening_port
                    phoneLinesDataDict['acs_url']=postCpeObj.acs_url
                    phoneLinesDataDict['cwmp_user_name']=postCpeObj.cwmp_user_name
                    phoneLinesDataDict['cwmp_password']=postCpeObj.cwmp_password
                    postCpeObjList.append(phoneLinesDataDict)
        data = json.dumps(postCpeObjList, sort_keys=False)
        print(postCpeObjList)
        return (data),200
    else:
        print("Authentication Failed", file=sys.stderr)
        return jsonify({'message': 'Authentication Failed'}), 401

@app.route("/getPhonesFromCpes", methods = ['GET'])
def getPhonesFromCPE():
    #cpeData = request.get_json()
    cpeData= ['20.17.210.213', '30.17.210.213']
    if True:
        phonesData=[]
        try:
            for cp in cpeData:
                phonesObs= PHONE_LINES.query.with_entities(PHONE_LINES).filter_by(cpe_ip_address=cp).all()
                if phonesObs:
                    for phonesOb in phonesObs:
                        phoneDataDict= {}
                        phoneDataDict['cpe_ip_address']=phonesOb.cpe_ip_address
                        phoneDataDict['user_name']=phonesOb.user_name
                        phoneDataDict['password']=phonesOb.password
                        phoneDataDict['registration_status']=phonesOb.registration_status
                        phoneDataDict['pre_migration_status']=phonesOb.pre_migration_status
                        phoneDataDict['migration_status']=phonesOb.migration_status
                        phoneDataDict['migration_status']=phonesOb.migration_status
                                    
                        phonesData.append(phoneDataDict)
        
            content = gzip.compress(json.dumps(phonesData).encode('utf8'), 5)
            response = make_response(content)
            response.headers['Content-length'] = len(content)
            response.headers['Content-Encoding'] = 'gzip'
            return response 
        except Exception as e:
            print(f"Failed to get  Phones from CPES", file=sys.stderr)
            return jsonify({'response': "Failed to get Phones from CPES"}), 500

@app.route("/getCpesFromPhones", methods = ['GET'])
def getCpeFromPhone():
    #phonesData = request.get_json()
    phonesData= ['20.17.210.213', '30.17.210.213', "20.17.210.213", "20.17.210.213"]
    phonesData= list(dict.fromkeys(phonesData))
    if True:
        cpeData=[]
        try:
            for phone in phonesData:
                cpeObs= CPE_TABLE.query.with_entities(CPE_TABLE).filter_by(cpe_ip_address=phone).all()
                if cpeObs:
                    for cpeOb in cpeObs:
                        cpeDataDict= {}
                        cpeDataDict['cpe_ip_address']=cpeOb.cpe_ip_address
                        cpeDataDict['model_number']=cpeOb.model_number
                        cpeDataDict['serial_number']=cpeOb.serial_number
                        cpeDataDict['mac_address']=cpeOb.mac_address
                        cpeDataDict['firmware']=cpeOb.firmware
                        cpeDataDict['outbound_ip']=cpeOb.outbound_ip
                        cpeDataDict['listening_port']=cpeOb.listening_port
                        cpeDataDict['acs_url']=cpeOb.acs_url
                        cpeDataDict['cwmp_user_name']=cpeOb.cwmp_user_name
                        cpeDataDict['cwmp_password']=cpeOb.cwmp_password
                        cpeDataDict['cwmp_annex']=cpeOb.cwmp_annex
                        cpeDataDict['cwmp_periodic_info']=cpeOb.cwmp_periodic_info
                    
                    cpeData.append(cpeDataDict)
                content = gzip.compress(json.dumps(cpeData).encode('utf8'), 5)
            response = make_response(content)
            response.headers['Content-length'] = len(content)
            response.headers['Content-Encoding'] = 'gzip'
            return response 
        except Exception as e:
            print(f"Failed to get  Phones from CPES", file=sys.stderr)
            return jsonify({'response': "Failed to get Phones from CPES"}), 500

@app.route("/getAllCpes", methods = ['GET'])
def GetAllCpes():
    cpeData= []
    print("HELLO WORLD",file=sys.stderr)
    if True:#request.headers.get('X-Auth-Key') == session.get('token', None):
        try:
            cpeObs= CPE_TABLE.query.with_entities(CPE_TABLE).all()
            if cpeObs:
                for cpeOb in cpeObs:
                    cpeDataDict= {}
                    cpeDataDict['cpe_ip_address']=cpeOb.cpe_ip_address
                    cpeDataDict['model_number']=cpeOb.model_number
                    cpeDataDict['serial_number']=cpeOb.serial_number
                    cpeDataDict['mac_address']=cpeOb.mac_address
                    cpeDataDict['firmware']=cpeOb.firmware
                    cpeDataDict['outbound_ip']=cpeOb.outbound_ip
                    cpeDataDict['listening_port']=cpeOb.listening_port
                    cpeDataDict['acs_url']=cpeOb.acs_url
                    cpeDataDict['cwmp_user_name']=cpeOb.cwmp_user_name
                    cpeDataDict['cwmp_password']=cpeOb.cwmp_password
                    cpeDataDict['cwmp_annex']=cpeOb.cwmp_annex
                    cpeDataDict['cwmp_periodic_info']=cpeOb.cwmp_periodic_info
                    
                    cpeData.append(cpeDataDict)
        
            content = gzip.compress(json.dumps(cpeData).encode('utf8'), 5)
            response = make_response(content)
            response.headers['Content-length'] = len(content)
            response.headers['Content-Encoding'] = 'gzip'
            return response 
        except Exception as e:
            print(f"Failed to get All CPE's", file=sys.stderr)
            return jsonify({'response': "Failed to get All CPE's"}), 500 

@app.route("/getCpeDetail", methods = ['GET'])
def GetCpeDetil():
    cpeData= []
    if True:#request.headers.get('X-Auth-Key') == session.get('token', None):
        #cpeData = request.get_json()
        cpeDetail=[]
        try:
            #cpeOb= CPE_TABLE.query.with_entities(CPE_TABLE).filter_by(cpe_ip_address= cpeData["ip_address"]).first()
            cpeObjs= CPE_TABLE.query.with_entities(CPE_TABLE).all()

            if cpeObjs:
                for cpeObj in cpeObjs:
                    cpeDataDict= {}
                    cpeDataDict['cpe_ip_address']=cpeObj.cpe_ip_address
                    cpeDataDict['model_number']=cpeObj.model_number
                    cpeDataDict['serial_number']=cpeObj.serial_number
                    cpeDataDict['mac_address']=cpeObj.mac_address
                    cpeDataDict['firmware']=cpeObj.firmware
                    cpeDataDict['outbound_ip']=cpeObj.outbound_ip
                    cpeDataDict['listening_port']=cpeObj.listening_port
                    cpeDataDict['acs_url']=cpeObj.acs_url
                    cpeDataDict['cwmp_user_name']=cpeObj.cwmp_user_name
                    cpeDataDict['cwmp_password']=cpeObj.cwmp_password
                    cpeDataDict['cwmp_annex']=cpeObj.cwmp_annex
                    cpeDataDict['cwmp_periodic_info']=cpeObj.cwmp_periodic_info
                
                    cpeDetail.append(cpeDataDict)
            
            content = gzip.compress(json.dumps(cpeDetail).encode('utf8'), 5)
            response = make_response(content)
            response.headers['Content-length'] = len(content)
            response.headers['Content-Encoding'] = 'gzip'
            return response 
        except Exception as e:
            print(f"Failed to get  CPE detail {e}", file=sys.stderr)
            return jsonify({'response': "Failed to get All CPE detail"}), 500 

@app.route("/getPhonesDetail", methods = ['POST'])
def GetPhonesDetail():
    cpeData= []
    if True:#request.headers.get('X-Auth-Key') == session.get('token', None):
        phoneData = request.get_json()
        print(f"Data is {phoneData}", file=sys.stderr)
        phoneDetail=[]
        try:
            phonesOb= PHONE_LINES.query.with_entities(PHONE_LINES).filter_by(cpe_ip_address= phoneData["ip_address"]).all()
            if phonesOb:
                for phone in phonesOb:
                    phoneDataDict= {}
                    phoneDataDict['cpe_ip_address']=phone.cpe_ip_address
                    phoneDataDict['user_name']=phone.user_name
                    phoneDataDict['password']=phone.password
                    phoneDataDict['registration_status']=phone.registration_status
                                
                    phoneDetail.append(phoneDataDict)
            
            content = gzip.compress(json.dumps(phoneDetail).encode('utf8'), 5)
            response = make_response(content)
            response.headers['Content-length'] = len(content)
            response.headers['Content-Encoding'] = 'gzip'
            return response 
        except Exception as e:
            print(f"Failed to get  Phones detail {e}", file=sys.stderr)
            return jsonify({'response': "Failed to get All CPE detail"}), 500 

@app.route("/getAllPhones", methods = ['GET'])
def GetAllPhoneLines():
    if True:#request.headers.get('X-Auth-Key') == session.get('token', None):
        phonesData=[]
 
        try:
            phonesObs= PHONE_LINES.query.with_entities(PHONE_LINES).all()
            if phonesObs:
                for phonesOb in phonesObs:
                    phoneDataDict= {}
                    phoneDataDict['cpe_ip_address']=phonesOb.cpe_ip_address
                    phoneDataDict['user_name']=phonesOb.user_name
                    phoneDataDict['password']=phonesOb.password
                    phoneDataDict['registration_status']=phonesOb.registration_status
                    phoneDataDict['pre_migration_status']=phonesOb.pre_migration_status
                    phoneDataDict['migration_status']=phonesOb.migration_status
                    phoneDataDict['migration_status']=phonesOb.migration_status
                                
                    phonesData.append(phoneDataDict)
            
            content = gzip.compress(json.dumps(phonesData).encode('utf8'), 5)
            response = make_response(content)
            response.headers['Content-length'] = len(content)
            response.headers['Content-Encoding'] = 'gzip'
            return response 
        except Exception as e:
            print(f"Failed to get All Phone Lines", file=sys.stderr)
            return jsonify({'response': "Failed to get All Phone Lines"}), 500 

@app.route("/migratePhonesFromCp", methods = ['POST'])
def MigratePhonesFromCP():
    if True:#request.headers.get('X-Auth-Key') == session.get('token', None):
        cpesData = request.get_json()
        print(cpesData,file=sys.stderr)
        ##'listening_port': '30005', 'ip_to_fqdn': 'www.test.com'
        #cpesData={'cp_ip_addresses':['10.17.210.200']}
        cps= cpesData['cp_ip_addresses']
        try:
            
            pocObj= Migration()
            for cp in cps:
                cpeOb= CPE_TABLE.query.with_entities(CPE_TABLE).filter_by(cpe_ip_address= cp).first()
                if cpeOb:
                    cpObj={}
                    cpObj['listening_port']= cpesData.get('listening_port', None)
                    cpObj['ip_to_fqdn']= cpesData.get('ip_to_fqdn', None)
                    cpObj['ip']= cp
                    cpObj['user_name']= cpeOb.cpe_username
                    cpObj['password']= cpeOb.cpe_password
                    cpObj['sw_type']= 'cisco_ios'

                    pocObj.migration(cpObj)
            
            return jsonify({'response': "Started Migration on CPE","code":"200"})
        except Exception as e: 
            print(f"Failed to Start Migration on CPE {e}", file=sys.stderr)
            return jsonify({'response': "Failed to Start Migration on CPE"}), 500  


@app.route("/getMigrationStatus", methods = ['GET'])
def GetMigrationStatus():
    if True:#request.headers.get('X-Auth-Key') == session.get('token', None):
        phonesData=[]
 
        try:
            phonesObs=  PHONE_LINES.query.with_entities(PHONE_LINES).filter(PHONE_LINES.migration_status!="Null").all()
            if phonesObs:
                for phonesOb in phonesObs:
                    phoneDataDict= {}
                    phoneDataDict['cpe_ip_address']=phonesOb.cpe_ip_address
                    phoneDataDict['user_name']=phonesOb.user_name
                    phoneDataDict['registration_status']=phonesOb.registration_status
                    phoneDataDict['pre_migration_status']=phonesOb.pre_migration_status
                    phoneDataDict['migration_status']=phonesOb.migration_status
                                
                    phonesData.append(phoneDataDict)
            
            content = gzip.compress(json.dumps(phonesData).encode('utf8'), 5)
            response = make_response(content)
            response.headers['Content-length'] = len(content)
            response.headers['Content-Encoding'] = 'gzip'
            return response 
        except Exception as e:
            print(f"Failed to get Migration Status {e}", file=sys.stderr)
            return jsonify({'response': "Failed to get Migration Status"}), 500 

