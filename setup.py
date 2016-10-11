from setuptools import setup, find_packages
import sys, os

version = '0.0'

requires = (
    'nextgisweb',
    'sqlalchemy',
    'python-magic',
    'Pillow'
)

entry_points = {
    'nextgisweb.packages': [
        'nextgisweb_media = nextgisweb_media:pkginfo',
    ],

    'nextgisweb.amd_packages': [
        'nextgisweb_media = nextgisweb_media:amd_packages',
    ],

}

setup(
    name='nextgisweb_media',
    version=version,
    description="Nextgisweb media layers extension",
    long_description="",
    classifiers=[
        "Programming Language :: Python",
        "Framework :: Pylons",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
    ],
    author='NextGIS',
    author_email='info@nextgis.ru',
    url='https://github.com/nextgis/nextgisweb_tracker',
    keywords='web pyramid nextgis GIS video leaflet',
    license='',
    packages=find_packages(exclude=['ez_setup', 'examples', 'tests']),
    include_package_data=True,
    zip_safe=False,
    install_requires=requires,
    entry_points=entry_points
)
