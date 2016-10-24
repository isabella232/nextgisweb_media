import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine, types, exists
from sqlalchemy.orm import sessionmaker

Base = declarative_base()


class Media(Base):
    __tablename__ = 'media'
    name = Column(Text, primary_key=True)
    width = Column(Integer)
    height = Column(Integer)
    type = Column(types.Enum('video', 'image'), nullable=False)
    corners = Column(Text)
    lat = Column(Float)
    lon = Column(Float)
    mime = Column(Text)
    fps = Column(Integer)
    duration = Column(Integer)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

path_to_db = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'media_metadata.db')
engine = create_engine('sqlite:///' + path_to_db)

# Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)

media_files_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'media_files')

import magic
from PIL import Image
import cv2

session = DBSession()
for filename in os.listdir(media_files_dir):
    media = DBSession().query(exists().where(Media.name == filename)).scalar()
    if not media:
        file_path = os.path.join(media_files_dir, filename)
        mime = magic.from_file(file_path, mime=True)
        mime_type = mime.split('/')[0]
        fps, duration = None, None
        if mime_type == 'image':
            with Image.open(file_path) as im:
                width, height = im.size
        elif mime_type == 'video':
            cap = cv2.VideoCapture(file_path)
            width = cap.get(cv2.cv.CV_CAP_PROP_FRAME_WIDTH)
            height = cap.get(cv2.cv.CV_CAP_PROP_FRAME_HEIGHT)
            fps = int(cap.get(cv2.cv.CV_CAP_PROP_FPS))
            duration = int(cap.get(cv2.cv.CV_CAP_PROP_FRAME_COUNT) / fps)
        else:
            raise Exception('Type "' + mime_type + '" is not supported.')
        media = Media(
            name=filename,
            width=width,
            height=height,
            type=mime_type,
            mime=mime,
            fps=fps,
            duration=duration
        )
        session.add(media)
session.commit()

