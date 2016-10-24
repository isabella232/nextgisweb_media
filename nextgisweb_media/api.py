# -*- coding: utf-8 -*-

from metadata import DBSession, Media


def get_media_items(request):
    session = DBSession()
    media_items = session.query(Media)
    media_items_result = []
    for media_item in media_items:
        media_items_result.append(media_item.as_dict())
    session.close()
    return media_items_result


def update_corners_layer(request):
    session = DBSession()
    media = session.query(Media).filter_by(name=request.POST['name']).first()
    media.corners = request.POST['corners']
    session.commit()
    session.close()
    return {
        'result': 'ok'
    }
