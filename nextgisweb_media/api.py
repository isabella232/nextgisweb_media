# -*- coding: utf-8 -*-

from nextgisweb.resource.model import Resource
from sqlalchemy.sql.operators import between_op
import geojson
from nextgisweb.feature_layer.api import ComplexEncoder
from pyramid.response import Response
from util import serialize
from metadata import DBSession, Media


def get_media_items(request):
    session = DBSession()
    media_items = session.query(Media)
    media_items_result = []
    for media_item in media_items:
        media_items_result.append(media_item.as_dict())
    return media_items_result

