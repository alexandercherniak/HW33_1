import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const REFRESH_MARKERS_MUTATION = "refreshMarkers";
export const REFRESH_FAVORITE_MARKER_ICON_MUTATION = "refresh_favorite_marker_icon";
export const REFRESH_FAVORITE_MARKERS_MUTATION = "refresh_favorite_markers";
export const REFRESH_MARKERS_ACTION = "refreshAction";
export const UPDATE_MARKER_POSITION_KEY_BY_INDEX_MUTATION = "update_marker_by_index_mutation";
export const UPDATE_MARKER_POSITION_BY_INDEX_MUTATION = "update_marker_position_by_index_mutation";
export const REMOVE_MARKER_MUTATION = "remove_marker_mutation";
export const ADD_MARKER_MUTATION = "add_marker_mutation";
export const ROUND_MARKER_POSITION_MUTATION = "round_marker_position_mutation";

const DEFAULT_MARKER = {
  position: {
    lat: 50,
    lng: 50
  }
};
let timer = 300,
  wait = false,
  checked = false;

export default new Vuex.Store({
  state: {
    markers: [{ position: { lat: -25.363, lng: 131.044 } }]
  },

  mutations: {
    [ADD_MARKER_MUTATION](state) {
      state.markers.push({ ...DEFAULT_MARKER });
    },
    [REFRESH_MARKERS_MUTATION](state, { markers }) {
      state.markers = markers;
    },
    [REFRESH_FAVORITE_MARKER_ICON_MUTATION](state, index) {
      if (!checked) {
        checked = true;
        state.markers[index].icon.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        }
    },
    [REFRESH_FAVORITE_MARKERS_MUTATION](state, index, markers) {
      if (!checked) {
        checked = true;
        state.markers[index] = markers;
      } 
    },
    [UPDATE_MARKER_POSITION_KEY_BY_INDEX_MUTATION](
      state,
      { index, value, positionKey }
    ) {
      state.markers[index].position[positionKey] = value;
    },
    [ROUND_MARKER_POSITION_MUTATION](
      state, 
      { index, positionKey }
      ) {
      let markerVal = state.markers[index].position[positionKey];
      markerVal = Math.floor(markerVal);
      state.markers[index].position[positionKey] = markerVal;
    },
    [UPDATE_MARKER_POSITION_BY_INDEX_MUTATION](state, { index, position }) {
      if (!wait) {
        wait = true;
        state.markers[index].position = position;
        setTimeout(() => {
          wait = false;
        }, timer);
      }
    },
    [REMOVE_MARKER_MUTATION](state, index) {
      state.markers.splice(index, 1);
    }
  },

  actions: {
    [REFRESH_MARKERS_ACTION]({ commit }) {
      const markers = [];
      const count = 10;
      const getLat = () => Math.random() * 180 - 90;
      const getLng = () => Math.random() * 360 - 180;

      for (let i = 0; i < count; i++) {
        markers[i] = {
          position: {
            lat: getLat(),
            lng: getLng()
          }
        };
      }
      commit({
        type: REFRESH_MARKERS_MUTATION,
        markers
      });
    }
  },
  modules: {}
});