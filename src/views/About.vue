<template>
  <div class="about">
    <h1>This page is using google maps vue material</h1>
    <div class="container">
      <div class="map-block">
        <GmapMap
          ref="mapRef"
          :center="mapCenter"
          :zoom="2"
          map-type-id="terrain"
          style="width: 600px; height: 600px"
        >
          <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :clickable="true"
            :draggable="true"
            :favorite="false"
            :icon="m.icon"
            @drag="onMarkerDrag($event, index)"
            @click="mapCenter = m.position" 
          />
        </GmapMap>
      </div>
      <div class="list-block">
        <div class="buttons">
          <md-button class="md-icon-button md-dense md-raised md-primary" @click="onRefresh"><md-icon>cached</md-icon></md-button>
          <md-button class="md-fab md-plain" @click="onRoundLatLng(index, 'lat')"><md-icon>edit</md-icon></md-button>
        </div>
        <md-table border="1">
          <colgroup>
            <col />
            <col style="width: 200px" />
            <col style="width: 200px" />
          </colgroup>
          <md-table-row>
            <md-table-head>#</md-table-head>
            <md-table-head>Lat</md-table-head>
            <md-table-head>Lng</md-table-head>
            <md-table-head>Del</md-table-head>
            <md-table-head>
              <label class="switch" @click="onRefreshFavorite(index)">
                <input type="checkbox">
                <span class="slider round">Only Fav</span>
              </label>
              <div v-if="checked=false"></div>
            </md-table-head>
          </md-table-row>
          <md-table-row
            class="table-row"
            v-for="(marker, index) in markers"
            :key="index"
            @dblclick="onSelectMarker(marker)"
          >
            <md-table-cell>{{ index }}</md-table-cell>
            <md-table-cell>
              <input
                type="number"
                min="-180"
                max="180"
                @input="onLatChange($event, index, 'lat')"
                :value="marker.position.lat"
              />
            </md-table-cell>
            <md-table-cell>
              <input
                type="number"
                min="-360"
                max="180"
                @input="onLatChange($event, index, 'lng')"
                :value="marker.position.lng"
              />
            </md-table-cell>
            <md-table-cell>
              <button @click="onRemove(index)">X</button>
            </md-table-cell>
            <md-table-cell>
              <input
                type="checkbox"
                v-model="checked"
                id="favorite"
                checked="false"
                :value="marker.position"
                @input="onRefreshMarker">
            </md-table-cell>
          </md-table-row>
        </md-table>
        <md-button class="md-icon-button md-raised" @click="onAddMarker">Add</md-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ADD_MARKER_MUTATION, REFRESH_FAVORITE_MARKER_ICON_MUTATION, REFRESH_FAVORITE_MARKERS_MUTATION,
  REFRESH_MARKERS_ACTION, REMOVE_MARKER_MUTATION, UPDATE_MARKER_POSITION_BY_INDEX_MUTATION,
  UPDATE_MARKER_POSITION_KEY_BY_INDEX_MUTATION, ROUND_MARKER_POSITION_MUTATION
} from "../store";
import { mapState } from "vuex";

export default {
  name: 'TableBasic',
  data() {
    return {
      mapCenter: { lat: -25.363, lng: 131.044 },
    };
  },
  computed: {
    ...mapState(["markers"])
  },
  methods: {
    onRefresh() {
      this.$store.dispatch(REFRESH_MARKERS_ACTION);
    },
    onRefreshMarker() {
      this.$store.commit(REFRESH_FAVORITE_MARKER_ICON_MUTATION);
    },
    onRefreshFavorite(index) {
      this.$store.commit(REFRESH_FAVORITE_MARKERS_MUTATION, index);
    },
    onSelectMarker(marker) {
      this.mapCenter = marker.position;
    },
    onLatChange(event, index, positionKey) {
      this.$store.commit({
        type: UPDATE_MARKER_POSITION_KEY_BY_INDEX_MUTATION,
        positionKey,
        index,
        value: +event.target.value
      });
    },
    onRoundLatLng(index, positionKey){
      this.$store.commit({
        type: ROUND_MARKER_POSITION_MUTATION,
        positionKey,
        index,
      });
    },
    onMarkerDrag(event, index) {
      this.$store.commit({
        type: UPDATE_MARKER_POSITION_BY_INDEX_MUTATION,
        index,
        position: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        }
      });
    },
    onRemove(index) {
      this.$store.commit(REMOVE_MARKER_MUTATION, index);
    },
    onAddMarker() {
      this.$store.commit(ADD_MARKER_MUTATION);
    }
  },
  created() {
    fetch('asdasdsad/check/markers').then(data => {
      if (data.updated) {
        this.$store.commit('DASFASD_UPDATE', data.markers)
      }
    })
  },
  mounted() {
    this.$refs.mapRef.$mapPromise.then(map => {
      map.panTo(this.mapCenter);
    });
  }
};
</script>

<style lang="scss">
.container {
  display: flex;
  .map-block,
  .list-block {
    width: 50%;
  }
}
.md-table-row {
  &:hover {
    background-color: aliceblue;
    cursor: pointer;
  }
  input {
    width: 80%;
    margin: 5px;
  }
}
.switch {
  position: relative;
  display: inline-block;
  width: 70px;
  height: 28px;
}

.switch input {
  display:none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(177, 7, 7);
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 28px;
  width: 28px;
  left: 8px;
  bottom: 0;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #0824f8;
}

input:focus + .slider {
  box-shadow: 0 0 1px #0824f8;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  font-size: 15px;
  font-weight: bold;
  color: #000000;
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
}
.md-fab {
  height: 33px;
  width: 33px;
}
</style>