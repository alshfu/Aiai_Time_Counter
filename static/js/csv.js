function new_input(data, class_name, name) {
    const input_tr_date = document.createElement('input')
    input_tr_date.type = 'text'
    input_tr_date.className = class_name
    input_tr_date.value = data
    input_tr_date.name = name
    return input_tr_date;
}

function createARow(clients_id, clients_name, employer_id, employer_name, day_of_work, time_of_work) {
    const new_input_group = document.createElement('div')
    new_input_group.className = 'input-group mb-1'
    // clients_id
    const input_clients_id = new_input(clients_id, 'form-control col justify-content-start', 'clients_id');
    input_clients_id.readOnly = "readonly"
    input_clients_id.style.display ="none"
    // clients_name
    const input_clients_name = new_input(clients_name, 'form-control col justify-content-start', 'clients_name');
    input_clients_name.readOnly = "readonly"
    // employer_id
    const input_employer_id = new_input(employer_id, 'form-control col justify-content-start', 'employer_id');
    input_employer_id.readOnly = "readonly"
    input_employer_id.style.display = "none"
    // employer_name
    const input_employer_name = new_input(employer_name, 'form-control  col justify-content-center', 'employer_name')
    input_employer_name.readOnly = "readonly"
    // time_of_work
    const input_time_of_work = new_input(time_of_work, 'form-control  col justify-content-center', 'time_of_work')
    input_time_of_work.readOnly = "readonly"
    // day_of_work
    const input_day_of_work = new_input(day_of_work, 'form-control col justify-content-center', 'day_of_work')
    input_day_of_work.readOnly = "readonly"

    new_input_group.appendChild(input_clients_id)
    new_input_group.appendChild(input_clients_name)
    new_input_group.appendChild(input_employer_id)
    new_input_group.appendChild(input_employer_name)
    new_input_group.appendChild(input_time_of_work)
    new_input_group.appendChild(input_day_of_work)


    document.getElementById("action_form").appendChild(new_input_group);

}

function UploadDealcsv() {
}


/*------ Method for read uploded csv file ------*/
UploadDealcsv.prototype.getCsv = function () {
    let input = document.getElementById('cvs_file');
    input.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            let myFile = this.files[0];
            let reader = new FileReader();
            reader.addEventListener('load', function (e) {
                let csvdata = e.target.result;
                parseCsv.getParseCsvData(csvdata); // calling function for parse csv data
            });

            reader.readAsBinaryString(myFile);
        }
    });
}

/*------- Method for parse csv data and display --------------*/
UploadDealcsv.prototype.getParseCsvData = function (data) {

    let parsedata = [];
    let newLinebrk = data.split("\n");
    for (let i = 0; i < newLinebrk.length; i++) {
        parsedata.push(newLinebrk[i].split(";"))
    }
    parsedata.shift()
    let line_counter = 1
    let time_counter = 0
    let clients = []
    let employers = []

    for (let line_from_csv of parsedata) {

        //console.log("0",line_from_csv[0]) // Brukare
        //console.log("1",line_from_csv[1]) // Brukare nr
        //console.log("2",line_from_csv[2]) // Brukare personnummer
        //console.log("3",line_from_csv[3]) // Assistent
        //console.log("4",line_from_csv[4]) // Anst nr
        //console.log("5",line_from_csv[5]) // Assistent personnummer
        //console.log("6",line_from_csv[6]) // Schematyp
        //console.log("7",line_from_csv[7]) // Kostnadsställe
        //console.log("8",line_from_csv[8]) // Beslut
        //console.log("9",line_from_csv[9]) // Månad
        //console.log("10",line_from_csv[10]) // Datum
        //console.log("11",line_from_csv[11]) // Start
        //console.log("12",line_from_csv[12]) // Slut
        //console.log("13",line_from_csv[13]) // Timmar
        //console.log("14",line_from_csv[14]) // Vardag kväll
        //console.log("15",line_from_csv[15]) // Vardag natt
        //console.log("16",line_from_csv[16]) // Veckoslut
        //console.log("17",line_from_csv[17]) // Veckoslut natt
        //console.log("18",line_from_csv[18]) // Storhelg
        //console.log("19",line_from_csv[19]) // Storhelg natt
        //console.log("20",line_from_csv[20]) // Jour vardag
        //console.log("21",line_from_csv[21]) // Jour helg
        //console.log(
        //    "Anstäld ID: ", line_from_csv[4],
        //    "Namn: ", line_from_csv[3],
        //    "Datum: ", line_from_csv[10],
        //    "Timmar: ", line_from_csv[13],
        //    "Månad: ", line_from_csv[9])
        if (line_from_csv[4] !== undefined) {
            if (!employers.includes(line_from_csv[1])) {
                employers.push(line_from_csv[1])
            }
            if (!clients.includes(line_from_csv[4])) {
                clients.push(line_from_csv[4])
            }
            line_counter = line_counter + 1
            time_counter = time_counter + parseFloat(line_from_csv[13])
            createARow(line_from_csv[1], // clients_id
                line_from_csv[0], // clients_name
                line_from_csv[4], // employer_id
                line_from_csv[3], // employer_name
                line_from_csv[10],// day_of_work
                line_from_csv[13] // time_of_work
            )
        }
    }
    console.log(line_counter, time_counter, clients, employers)
    document.getElementById('file_info').innerHTML = "<br>" + "Total bruckare: " + String(employers.length) + "<br>" + "Total anstälda: " + String(clients.length) + "<br>" + "Total timar: " + String(time_counter)
    document.getElementById("action_form").style.display = ""
}



function to_hash(string) {
    let hash = 0;
    // if (string.length == 0) return hash;
    // for (x = 0; x < string.length; x++) {
    //     ch = string.charCodeAt(x);
    //     hash = ((hash << 5) - hash) + ch;
    //     hash = hash & hash;
    // }
    return hash;
}

let parseCsv = new UploadDealcsv();
parseCsv.getCsv();
