from typing import List

from sqlalchemy import Column, Integer, String, Text, Date, Float, ForeignKey
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates

from app import DB, ValidationError


class Record(DB.Model):
    """ Record model (e.g. event, building, historical location etc.) """
    __tablename__ = 'record'

    # primary key
    id = Column(Integer, primary_key=True)

    # data
    name = Column(String(128), nullable=False)
    description = Column(Text, nullable=True)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    time_period = Column(Date, index=True, nullable=False,
                         doc='E.g. time when a building was built or time period of the event'
                             '(not a time when the event is happening)')
    price = Column(String(256), nullable=True)
    photo_url = Column(String(256), nullable=True)
    categories = Column(String(512), nullable=False)
    link = Column(String(512), nullable=True)

    @validates('latitude')
    def validate_latitude(self, key, latitude):
        # latitude should be in some bounds
        if not (49.10 <= latitude <= 49.31):
            raise ValidationError(
                errors=dict(
                    latitude='Not in range <49.10, 49.31> (Brno and surrounding area)'
                )
            )
        return latitude

    @validates('longitude')
    def validate_longitude(self, key, longitude):
        # longitude should be in some bounds
        if not (16.45 <= longitude <= 16.77):
            raise ValidationError(
                errors=dict(
                    longitude='Not in range <16.45, 16.77> (Brno and surrounding area)'
                )
            )
        return longitude

    @hybrid_property
    def category_list(self) -> List[str]:
        return [c.strip() for c in self.categories.split(';')]


class EventRecord(Record):
    """ EventRecord adds some additional data to Record """
    __tablename__ = "event_record"

    # primary key
    id = Column(Integer, ForeignKey('record.id'), primary_key=True, index=True)

    # data
    event_date = Column(Date, nullable=False, doc='time when the event is happening')

    # Settings
    __mapper_args__ = {
        'polymorphic_identity': __tablename__
    }
