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

// regex f+[123456789]*[24680]

var app = new Vue({
    el: '#app',
    data: {
        helpButton: "Help me",
        showHelp: false,
        showApp: true,
        showError: false,
        error:"",
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
            axios({
                method: 'post',
                url: 'http://michelwander.pythonanywhere.com/arq2',
                data: json,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                this.showError = false;
                table.showTable = true;
                this.showApp = false;
                table.result = response.data;
            }).catch((e) => {
                this.error = "";
                this.showHelp = false;
                this.showError = true;
            });
        },
        getJSON: function(){
            return({
                'numberOfInstructions': this.numberOfInstructions,
                'latADDD': this.latADD,
                'latSUBD': this.latSUBD,
                'latMULTD': this.latMULTD,
                'latDIVD':  this.latDIVD,
                'latLD':  this.latLD,
                'latSD':  this.latSD,
                'latADD': this.latADD,
                'latDADDUI': this.latDADDUI,
                'latBEQ': this.latBEQ,
                'latBNEZ':  this.latBNEZ,
                'instructions': this.instructions                 
            })
        },
        getHelp: function(){
            this.showHelp = !this.showHelp;
            this.showHelp ? this.helpButton = "Hide help" : this.helpButton = "Help me"
        }
    }
})

var table = new Vue({
    el: '#table',
    updated: function(){
        if(this.firstUpdate){
            this.mainTable = this.result.mainTable; 
            this.unitTable = this.result.unitTable;
            this.registerTable = this.result.registerTable;
            this.firstUpdate = false;
            console.log("update");
        }
        
    },
    data: {
        firstUpdate: true,
        showTable: false,
        result: {},
        tableIndex: 1,
        mainTable: {},
        unitTable: {},
        registerTable: {}
    },
    methods: {
        nextStep: function(){
            this.tableIndex < Object.keys(this.mainTable).length ? this.tableIndex++ : null ;
        },
        stepBack: function(){
            this.tableIndex > 0 ? this.tableIndex-- : null ;
        },
        finalTable: function(){
            this.tableIndex = Object.keys(this.mainTable).length;
        },
        backToIndex: function(){
            this.showTable = false;
            app.showApp = true;
        }
    }
})