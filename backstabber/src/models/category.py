from sqlalchemy import Column, Integer, String, Text, Table, ForeignKey
from sqlalchemy.orm import relationship

from app import DB

association_table = Table('association', DB.Model.metadata,
                          Column('category_id', Integer, ForeignKey('category.id')),
                          Column('record_id', Integer, ForeignKey('record.id'))
                          )


class Category(DB.Model):
    """ Record category (a parent in M to N relationship) """
    __tablename__ = 'category'

    # primary key
    id = Column(Integer, primary_key=True, index=True)

    # data
    name = Column(String(128), nullable=False)
    description = Column(Text, nullable=True)

    # relations
    records = relationship(
        "Record",
        secondary=association_table,
        back_populates="categories")
