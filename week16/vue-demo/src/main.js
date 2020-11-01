import HelloWorld from './HelloWorld.vue';
import Vue from "Vue";

new Vue({
    el:"#app",
    // template:"<HelloWorld />",
    // comments:{HelloWorld}
    render:h => h(HelloWorld)
})