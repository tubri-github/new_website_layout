L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({

    onAdd: function (map) {
        // Triggered when the layer is added to a map.
        //   Register a click listener, then do all the upstream WMS things
        L.TileLayer.WMS.prototype.onAdd.call(this, map);
        map.on('click', this.getFeatureInfo, this);
    },

    onRemove: function (map) {
        // Triggered when the layer is removed from a map.
        //   Unregister a click listener, then do all the upstream WMS things
        L.TileLayer.WMS.prototype.onRemove.call(this, map);
        map.off('click', this.getFeatureInfo, this);
    },

    getFeatureInfo: function (evt) {
        // Make an AJAX request to the server and hope for the best
        var url = this.getFeatureInfoUrl(evt.latlng),
            showResults = L.Util.bind(this.showGetFeatureInfo, this);
        $.ajax({
            url: url,
            success: function (data, status, xhr) {
                //var err = typeof data === 'string' ? null : data;
                var err;
                showResults(err, evt.latlng, data);
            },
            error: function (xhr, status, error) {
                showResults(error);
            }
        });
    },

    getFeatureInfoUrl: function (latlng) {
        // Construct a GetFeatureInfo request URL given a point
        var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
            size = this._map.getSize(),
            // crs = this.options.crs || this._map.options.crs,
            //
            // // these are the SouthWest and NorthEast points
            // // projected from LatLng into used crs
            // sw = crs.project(this._map.getBounds().getSouthWest()),
            // ne = crs.project(this._map.getBounds().getNorthEast()),


            params = {
                request: 'GetFeatureInfo',
                service: 'WMS',
                srs: 'EPSG:4326',
                styles: this.wmsParams.styles,
                transparent: this.wmsParams.transparent,
                version: this.wmsParams.version,
                format: this.wmsParams.format,
                bbox: this._map.getBounds().toBBoxString(),
                // bbox: sw.x + ',' + sw.y + ',' + ne.x + ',' + ne.y,
                height: size.y,
                width: size.x,
                layers: this.wmsParams.layers,
                query_layers: this.wmsParams.layers,
                info_format: 'application/json'
            };

        params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x);
        params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y);

        return this._url + L.Util.getParamString(params, this._url, true);
    },

    showGetFeatureInfo: function (err, latlng, content) {
        if (err) { console.log(err); return; } // do nothing if there's an error
        if (geoJsonLayerGoup.getLayers().length>0 && content.features.length >=1){
            removeGeoJsonLayer(geoJsonLayerGoup)
        }
        addGeoJsonLayer(content,geoJsonLayerGoup)
        $('#basin-data').selectpicker('val', content.features[0].properties.basin_id);
        // Otherwise show the content in a popup, or something.
        // L.popup({ maxWidth: 800})
        //     .setLatLng(latlng)
        //     .setContent(content)
        //     .openOn(this._map);
    }
});

function addGeoJsonLayer(data,jsonLayerGroup){
    tempGeoJsonLayer = L.geoJSON(data,{
        style:polygonStyle,
        onEachFeature: function (feature, layer){
        }
    })
    jsonLayerGroup.addLayer(tempGeoJsonLayer)
}
function removeGeoJsonLayer(jsonLayerGroup){
    jsonLayerGroup.clearLayers()
}
function polygonStyle(feature) {
    return {
        fillColor: 'blue',
        weight: 2,
        opacity: 1,
        color: 'white',  //Outline color
        fillOpacity: 0.7
    };
}
L.tileLayer.betterWms = function (url, options) {
    return new L.TileLayer.BetterWMS(url, options);
};