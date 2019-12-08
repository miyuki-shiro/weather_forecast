<style>
    #app { padding: 0em 2em; }
    .cwicon { position: relative; left: 30px; font-size: 8em; }
    .icons1 { margin-left: 6em; position: relative; bottom: 50px; }
    .icons2 { margin: 1em 0em; }
    .iconlabel { font-size: 1.2em; text-transform: capitalize; }
    .iconlabelmargin { margin: 0em 2.5em 0em 0.5em; }
    .error { margin-top: 3em; }
</style>

<template>
    <div id="app">
        <section class="section section-padding">
            <div class="has-text-centered">
                <h1 class="title">Chilean Weather</h1>
            </div>
        </section>
            
        <section style="padding-bottom: 5em">
            <div class="columns is-centered">
                <div class="column is-half">
                    <b-field>
                        <b-input placeholder="Name of the city..." type="search" v-model="place" expanded></b-input>
                        <p class="control"><button class="button is-primary" @click="getWeather">Search</button></p>
                    </b-field>
                    
                    <div v-if="loading" class="error has-text-centered">
                         <b-icon pack="fas" icon="spinner" size="is-large" custom-class="fa-pulse"></b-icon>
                         <br><p>Loading</p>
                    </div>
                    <div v-if="cerror" class="error has-text-centered">
                        <b-icon icon="alert-circle" size="is-medium" type="is-primary"></b-icon>
                        <br><p>Nothing found. Try again...</p>
                    </div>
                </div>
            </div>
        </section>    

        <b-tabs v-show="c != ''" type="is-boxed" position="is-centered" expanded>
            <b-tab-item label="Current Weather">
                <div class="columns section">
                    <div class="column is-half is-7 is-flex has-text-centered" style="padding-top: 4em">
                        <b-icon :icon=iconSet type="is-primary" class="cwicon" size="is-large"></b-icon>
                        <div class="icons1">
                            <p style="font-size: 4em">{{currentTemp}}</p>
                            <p class="iconlabel">{{overcast}}</p>
                            <p class="iconlabel">{{location}}</p>
                        </div>
                    </div>
                    <div class="column is-half">
                        <label class="iconlabel">{{today}}</label>
                        <div class="icons2">
                            <b-icon icon="arrow-up" size="is-medium"></b-icon><label class="iconlabel iconlabelmargin">{{maxTemp}}</label>
                            <b-icon icon="arrow-down" size="is-medium"></b-icon><label class="iconlabel iconlabelmargin">{{minTemp}}</label>
                        </div>
                        <div class="icons2">
                            <b-icon icon="weather-sunset-up" size="is-medium"></b-icon><label class="iconlabel iconlabelmargin">{{sunrise}}</label>
                            <b-icon icon="weather-sunset-down" size="is-medium"></b-icon><label class="iconlabel iconlabelmargin">{{sunset}}</label>
                        </div>
                        <div class="icons2">
                            <b-icon icon="water" size="is-medium"></b-icon><label class="iconlabel iconlabelmargin">{{humidity}}</label>
                            <b-icon icon="weather-windy" size="is-medium"></b-icon><label class="iconlabel iconlabelmargin">{{wind}}</label>
                        </div>
                    </div>
                </div>
            </b-tab-item>

            <b-tab-item label="Next five days...">
                <div v-show="chart != null" style="padding: 0em; margin: 0em;">
                    <canvas id="myChart"></canvas>
                </div>
                <div v-if="ferror" class="error has-text-centered">
                        <b-icon icon="alert-circle" size="is-medium" type="is-primary"></b-icon>
                        <br><p>Nothing found. Try again...</p>
                    </div>
            </b-tab-item>
        </b-tabs>
    </div>
</template>



<script>
import axios from 'axios'
import { CURRENT_WEATHER_BASE_URL, CURRENT_WEATHER_LAST_URL, CURRENT_FORECAST_BASE_URL } from '../config'
import Chart from 'chart.js';

const customIconConfig = {
    customIconPacks: {
        'mdi': { sizes: { 'default': null, 'is-small': 'mdi-24px', 'is-medium': 'mdi-36px', 'is-large': '' } }
    }
}

export default {
    name: 'app',
    data() {
        return {
            loading: false, place: '', c: '', f: '', cerror: '', ferror: '',
            iconRes: '', iconSet: '', 
            options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
            currentTemp: '', minTemp: '', maxTemp:'', sunrise: '', sunset: '', pressure: '', humidity: '', 
                wind: '', overcast: '', today: '', location: '',             
            icons: [
                { value: '01d', name:'weather-sunny' }, 
                { value: '01n', name:'weather-night' }, 
                { value: '02d', name:'weather-partly-cloudy' }, 
                { value: '02n', name:'weather-night-partly-cloudy' }, 
                { value: '03d', name:'weather-cloudy' }, 
                { value: '03n', name:'weather-cloudy' }, 
                { value: '04d', name:'cloud' }, 
                { value: '04n', name:'cloud' }, 
                { value: '09d', name:'weather-rainy' }, 
                { value: '09n', name:'weather-rainy' }, 
                { value: '10d', name:'weather-pouring' }, 
                { value: '10n', name:'weather-pouring' }, 
                { value: '11d', name:'weather-lightning-rainy' }, 
                { value: '11n', name:'weather-lightning-rainy' }, 
                { value: '13d', name:'snowflake' }, 
                { value: '13n', name:'snowflake' }, 
                { value: '50d', name:'weather-fog' }, 
                { value: '50n', name:'weather-fog' }
            ],
            dates: [], temps: [], chart: null, 
        }
    },
    created() {
        this.$buefy.config.setOptions(customIconConfig)
    },
    methods: { 
        getWeather: function() {
            this.c = '', this.cerror = ''
            axios.get(CURRENT_WEATHER_BASE_URL + this.place + CURRENT_WEATHER_LAST_URL)
                .then(response => {
                    this.c = response
                    this.today = new Date().toLocaleDateString('en-US', this.options)
                    this.location = response.data.name
                    this.currentTemp = Math.floor(response.data.main.temp) + '°C'
                    this.minTemp = Math.floor(response.data.main.temp_min) + '°C'
                    this.maxTemp = Math.floor(response.data.main.temp_max) + '°C'
                    this.pressure = response.data.main.pressure
                    this.humidity = response.data.main.humidity + '%'
                    this.wind = response.data.wind.speed + 'm/s'
                    this.overcast = response.data.weather[0].description;
                    this.sunrise = new Date(response.data.sys.sunrise*1000).toLocaleTimeString('es-CL').slice(0,5)
                    this.sunset = new Date(response.data.sys.sunset*1000).toLocaleTimeString('es-CL').slice(0,5)
                    this.iconRes = response.data.weather[0].icon.slice(0, 3)
                    this.icons.forEach(element => {
                        if (element.value == this.iconRes) {
                            this.iconSet = element.name
                        }
                    });
                })
                .catch(error => { this.cerror = error; })
                .finally(() => (this.loading = false))
                this.getForecast()
        },
        getForecast: function() {      
            this.f = '', this.ferror = ''
            if (this.chart != null) { this.chart.destroy(); }
            axios.get(CURRENT_FORECAST_BASE_URL + this.place + CURRENT_WEATHER_LAST_URL)
                .then(response => { 
                    this.f = response
                    this.dates = response.data.list.map(list => { return list.dt_txt; })
                    this.temps = response.data.list.map(list => { return list.main.temp; })

                    var ctx = document.getElementById("myChart")
                    this.chart = new Chart(ctx, {
                        type: "line",
                        data: {
                            labels: this.dates,
                            datasets: [{
                                label: "Temperature",
                                backgroundColor: "#8c67ef",
                                borderColor: "#8c67ef",
                                fill: false,
                                data: this.temps
                            }]
                        },
                        options: {
                            tooltips: {
                                callbacks: {
                                    label: function(tooltipItem, data) {
                                        var label = data.datasets[tooltipItem.datasetIndex].label || ""
                                        if (label) { label += ": " }
                                        label += Math.floor(tooltipItem.yLabel)
                                        return label + "°C"
                                    }
                                }
                            },
                            scales: {
                                xAxes: [{
                                    type: "time",
                                    time: {
                                        unit: "hour",
                                        displayFormats: { hour: "DD MMM. @ H:mm" },
                                        tooltipFormat: "DD MMM. @ H:mm"
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Date @ Time"
                                    },
                                    ticks: {
                                        maxTicksLimit: 5
                                    }
                                }],
                                yAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Temperature (°C)"
                                    },
                                    ticks: {
                                        maxTicksLimit: 5,
                                        callback: function(value) { return value + "°C" }
                                    }
                                }]
                            }
                        }
                    });
                })
                .catch(error => { this.ferror = error; })
                .finally(() => (this.loading = false))
        },
    }
    
}
</script>
