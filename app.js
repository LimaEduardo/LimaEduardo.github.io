Vue.component('instruction', {
    data: function () {
        return {
            instructions: ['ADD.D','SUBD','MULTD','DIV.D','L.D','S.D','ADD','DADDUI', 'BEQ', 'BNEZ'],
            rs: '',
            rt: '',
            rd: '',
            instructionSelected: ''
        }
    },
    template: '<div class="row"><select v-model="instructionSelected" class="form-control col-md-3"><option v-for="i in instructions" :value="i">{{i}}</option>\
    </select>\
    <input v-model="rs" type="text" class="form-control col-md-3" placeholder="RD">\
    <input v-if="!isBnez()" v-model="rt" type="text" class="form-control col-md-3" placeholder="RS">\
    <input v-model="rd" type="text" class="form-control col-md-3" placeholder="RT">\
    </div>',
    methods: {
        isBnez : function(){
            return this.instructionSelected === 'BNEZ' ? true : false;
        }
    }
})


var app = new Vue({
    el: '#app',
    data: {
        numberOfInstructions: 0,
        integerCycles: 0,
        instructions: [],
        latADDD: 0,
        latSUBD: 0,
        latMULTD: 0,
        latDIVD: 0,
        latLD: 0,
        latSD: 0,
        latADD: 0,
        latDADDUI: 0,
        latBEQ: 0,
        latBNEZ: 0
    },
    methods: {
        updateNumInstructions: function(){
            console.log(this.numberOfInstructions);
        },
        sendInfo: function(){
            this.instructions = [];
            this.$children.forEach(element => {
                element.instructionSelected === 'BNEZ' ? element.rt = null : element.rt;
                var instruction = {
                    'instructionName': element.instructionSelected,
                    'rs': element.rs,
                    'rt': element.rt,
                    'rd': element.rd
                };
                this.instructions.push(instruction);
            });;
            var json = JSON.stringify(this.getJSON());
            console.log(json);
            axios({
                method: 'post',
                url: 'http://localhost:3000/sb',
                data: json,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getJSON: function(){
            return({
                'numberOfInstructions': this.numberOfInstructions,
                'latADDD': this.latADD,
                'latSUBD': this.latSUBD,
                'latMULTD': this.latMULTD,
                'latDIVD':  this.latDIVD,
                'latLD':  this.latLDD,
                'latSD':  this.latSDD,
                'latADD': this.latADD,
                'latDADDUI': this.latDADDUI,
                'latBEQ': this.latBEQ,
                'latBNEZ':  this.latBNEZ,
                'instructions': this.instructions                 
            })
        }
    }
})