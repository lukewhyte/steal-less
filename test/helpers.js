var steal = require("@steal");
var global = require("@loader").global;
global.LESS_SOURCES = {};
global.LESS_USED_SOURCES = [];

module.exports = function(loader){
	var oldFetch, oldLessLoad;
	var sources = {};

	var mockedFetch;
	var overrideFetch = mockedFetch = function () {
		oldFetch = loader.fetch;
		loader.fetch = function(load){
			if(sources[load.name]) {
				return Promise.resolve(sources[load.name]);
			}
			return oldFetch.apply(this, arguments);
		};
		overrideFetch = function(){};
	};

	return {
		mockLiveReload: function(isReloading){
			loader.liveReloadInstalled = true;
			loader.set("live-reload", loader.newModule({
				isReloading: function(){
					return typeof isReloading === "boolean" ?
						isReloading : true;
				}
			}));
		},
		provide: function(name, source){
			overrideFetch();
			sources[name] = source;
		},
		provideLess: function(pth, source){
			var exp = typeof pth === "string" ? new RegExp(pth) : pth;
			global.LESS_SOURCES[exp.toString()] = {
				exp: exp,
				code: source
			};
		},
		restore: function(){
			if(oldFetch) {
				loader.fetch = oldFetch;
				overrideFetch = mockedFetch;
			}
			sources = {};
			global.LESS_SOURCES = {};
			global.LESS_USED_SOURCES = [];
			loader.delete("live-reload");
			delete loader.liveReloadInstalled;
		}
	};
};
