# -*- coding: utf-8 -*-
import json

from lxml import etree
from pyramid.response import Response

from nextgisweb.resource import Widget
from nextgisweb.env import env
from nextgisweb.object_widget import ObjectWidget
from nextgisweb.resource.model import Resource
from .util import _
from api import *


def setup_pyramid(comp, config):
    def display_tracker(request):
        return dict(
            display_config={},
            custom_layout=True
        )

    config.add_route(
        'display.media', '/media'
    ).add_view(display_tracker, renderer='nextgisweb_media:templates/media.mako')

    config.add_route(
        'api.media.items', '/api/media/items'
    ).add_view(get_media_items, renderer='json')
