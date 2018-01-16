Vue.component('instruction', {
    data: function () {
        return {
            instructions: ['ADD.D','SUBD','MULTD','DIV.D','L.D','S.D','ADD','DADDUI', 'BEQ', 'BNEZ'],
            rs: '',
            rt: '',
            rd: '',
            instructionSelected: '',
            warning: false,
            textWarning: '',
            dontCheck: ['L.D', 'S.D', 'DADDUI', 'ADD', 'BEQ', 'BNEZ']
        }
    },

//     <div class="form-group has-warning">
//     <label class="control-label" for="inputWarning">Input with warning</label>
//     <input type="text" class="form-control" id="inputWarning">
//     <span class="help-block">Something may have gone wrong</span>
//   </div>
    template: '<div class="row"><select v-model="instructionSelected" class="form-control col-md-3"><option v-for="i in instructions" :value="i">{{i}}</option>\
    </select>\
    <input v-model="rs" @blur="itsAcceptable()" type="text" class="form-control col-md-3" placeholder="RD">\
    <input v-if="!isBnez()" @blur="itsAcceptable()" v-model="rt" type="text" class="form-control col-md-3" placeholder="RS">\
    <input v-model="rd" @blur="itsAcceptable()" type="text" class="form-control col-md-3" placeholder="RT">\
    <p v-if="warning" class="text-warning">Some variables are written in a non-recomended way. Check it.</p>\
    </div>',
    methods: {
        isBnez : function(){
            return this.instructionSelected === 'BNEZ';
        },
        itsAcceptable: function(){
            if (this.dontCheck.includes(this.instructionSelected)){
                this.warning = false;
                return;
            }
            pattern = new RegExp(/(f+((\d)*)([02468]+))\b/);
            var existsAnError = false;
            if(this.rs !== ""){
                pattern.test(this.rs) ? null : existsAnError = true
            }
            if(this.rd !== ""){
                pattern.test(this.rd) ? null : existsAnError = true
            }
            if(this.rt !== ""){
                pattern.test(this.rt) ? null : existsAnError = true
            }
            this.warning = existsAnError;
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
        latBNEZ: 0,
        apiLink: "http://michelwander.pythonanywhere.com/arq2"
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
            console.log("requisita");
            axios({
                method: 'post',
                url: this.apiLink,
                data: json,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                console.log("show");
                this.showError = false;
                table.showTable = true;
                this.showApp = false;
                table.result = response.data;
            }).catch((e) => {
                console.log("n show");
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
            this.showHelp ? this.helpButton = "Hide help" : this.helpButton = "Help me";
        },
        clearValues: function(){
            console.log("called");
            this.numberOfInstructions = 0,
            this.integerCycles = 0,
            this.instructions = [],
            this.latADDD = 0,
            this.latSUBD = 0,
            this.latMULTD = 0,
            this.latDIVD = 0,
            this.latLD = 0,
            this.latSD = 0,
            this.latADD = 0,
            this.latDADDUI = 0,
            this.latBEQ = 0,
            this.latBNEZ = 0
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
            app.clearValues();
        }
    }
})