from app import db
from sqlalchemy import ForeignKey
from datetime import datetime

class CPE_TABLE(db.Model):
    __tablename__ = 'cpe_table'
    cpe_ip_address = db.Column(db.String(50), primary_key=True)
    cpe_username = db.Column(db.String(50))
    cpe_password = db.Column(db.String(50))
    model_number = db.Column(db.String(50))
    serial_number = db.Column(db.String(50))
    mac_address = db.Column(db.String(50))
    firmware = db.Column(db.String(50))
    outbound_ip = db.Column(db.String(50))
    listening_port = db.Column(db.String(50))
    acs_url = db.Column(db.String(50))
    cwmp_user_name = db.Column(db.String(50))
    cwmp_password = db.Column(db.String(50))
    cwmp_annex = db.Column(db.String(50))
    cwmp_periodic_info = db.Column(db.String(50))

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class POST_CPE_TABLE(db.Model):
    __tablename__ = 'post_cpe_table'
    cpe_ip_address = db.Column(db.String(50), primary_key=True)
    cpe_username = db.Column(db.String(50))
    cpe_password = db.Column(db.String(50))
    model_number = db.Column(db.String(50))
    serial_number = db.Column(db.String(50))
    mac_address = db.Column(db.String(50))
    firmware = db.Column(db.String(50))
    outbound_ip = db.Column(db.String(50))
    listening_port = db.Column(db.String(50))
    acs_url = db.Column(db.String(50))
    cwmp_user_name = db.Column(db.String(50))
    cwmp_password = db.Column(db.String(50))
    cwmp_annex = db.Column(db.String(50))
    cwmp_periodic_info = db.Column(db.String(50))

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}



class PHONE_LINES(db.Model):
    __tablename__ = 'phone_lines'
    phone_lines_id = db.Column(db.Integer, primary_key=True)
    cpe_ip_address = db.Column(db.String(50), ForeignKey('cpe_table.cpe_ip_address'))
    user_name = db.Column(db.String(50))
    password = db.Column(db.String(50))
    registration_status = db.Column(db.String(50))
    pre_migration_status = db.Column(db.String(50))
    migration_status = db.Column(db.String(50))
    status_update_time = db.Column(db.DateTime)    

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}
