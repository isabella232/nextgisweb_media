# -*- coding: utf-8 -*-
from nextgisweb.component import Component, require

from .metadata import *


class MediaComponent(Component):
    identity = 'media'
    # metadata = Base.metadata

    @require('render', 'marker_library')
    def initialize(self):
        super(MediaComponent, self).initialize()

    def setup_pyramid(self, config):
        super(MediaComponent, self).setup_pyramid(config)
        from . import view
        view.setup_pyramid(self, config)
        config.add_static_view(name='media-files', path='nextgisweb_media:media_files')

    def client_settings(self, request):
        return dict(
            media_path=self.settings.get('media_path')
        )

    settings_info = (

    )


def pkginfo():
    return dict(components=dict(media="nextgisweb_media"))


def amd_packages():
    return ((
        'ngw-media', 'nextgisweb_media:amd/ngw-media'
    ),)
