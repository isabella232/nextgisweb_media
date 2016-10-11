<%inherit file='nextgisweb:pyramid/template/base.mako' />

<%def name="title()">Tracks Map</%def>

<%def name="head()">
    <% import json %>

    <script type="text/javascript">
        var ngwServiceFacade,
                displayConfig = ${json.dumps(display_config, indent=4).replace('\n', '\n' + (8 * ' ')) | n};

        require(['dojo/text!ngw-media/leaflet/package.json'], function (leafletPackage) {
                    document.packages = document.packages || {};
                    document.packages.leaflet = JSON.parse(leafletPackage);

                    require([
                        'dojo/parser',
                        'dojo/ready',
                        'ngw-media/NgwServiceFacade',
                        'ngw-media/Display'
                    ], function (parser,
                                 ready,
                                 NgwServiceFacade) {
                        ready(function () {
                            ngwServiceFacade = new NgwServiceFacade(ngwConfig.applicationUrl);
                            parser.parse();
                        });
                    });
                }
        );
    </script>

    <style type="text/css">
        body, html {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
    </style>

</%def>

<div data-dojo-type="ngw-media/Display"
     data-dojo-props="ngwConfig: ngwConfig, ngwServiceFacade: ngwServiceFacade"
     style="width: 100%; height: 100%;">
</div>


