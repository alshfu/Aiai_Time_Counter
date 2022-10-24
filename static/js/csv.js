function new_input(data, class_name, name) {
    const input_tr_date = document.createElement('input')
    input_tr_date.type = 'text'
    input_tr_date.className = class_name
    input_tr_date.value = data
    input_tr_date.name = name
    return input_tr_date;
}

function createARow(clients_id, clients_name, employer_id, employer_name, day_of_work, time_of_work, start_of_work, end_of_work) {
    const new_input_group = document.createElement('div')
    new_input_group.className = 'input-group mb-1'
    // clients_id
    const input_clients_id = new_input(clients_id, 'form-control col justify-content-start', 'clients_id');
    input_clients_id.readOnly = "readonly"
    input_clients_id.style.display = "none"
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
    //work start
    const input_start_of_work = new_input(start_of_work, 'form-control col justify-content-center', 'start_of_work')
    input_start_of_work.readOnly = "readonly"
    input_start_of_work.style.display = "none"
    //work end
    const input_end_of_work = new_input(end_of_work, 'form-control col justify-content-center', 'end_of_work')
    input_end_of_work.readOnly = "readonly"
    input_end_of_work.style.display = "none"

    new_input_group.appendChild(input_clients_id)
    new_input_group.appendChild(input_clients_name)
    new_input_group.appendChild(input_employer_id)
    new_input_group.appendChild(input_employer_name)
    new_input_group.appendChild(input_time_of_work)
    new_input_group.appendChild(input_day_of_work)
    new_input_group.appendChild(input_start_of_work)
    new_input_group.appendChild(input_end_of_work)


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
        if (line_from_csv[4] !== undefined) {
            if (!employers.includes(line_from_csv[1])) {
                employers.push(line_from_csv[1])
            }
            if (!clients.includes(line_from_csv[4])) {
                clients.push(line_from_csv[4])
            }
            line_counter = line_counter + 1
            time_counter = time_counter + parseFloat(line_from_csv[13])
            console.log(line_from_csv)
            createARow(
                clients_id = line_from_csv[1], // clients_id
                clients_name = line_from_csv[0], // clients_name
                employer_id = line_from_csv[4], // employer_id
                employer_name = line_from_csv[3], // employer_name
                day_of_work = line_from_csv[10],// day_of_work
                time_of_work = line_from_csv[13], // time_of_work
                start_of_work = line_from_csv[11],// start_of_work
                end_of_work = line_from_csv[12],// end_of_work
            )
        }
    }
    console.log(line_counter, time_counter, clients, employers)
    document.getElementById('file_info').innerHTML = "<br>" + "Total bruckare: " + String(employers.length) + "<br>" + "Total anstälda: " + String(clients.length) + "<br>" + "Total timar: " + String(time_counter)
    document.getElementById("action_form").style.display = ""
}


let parseCsv = new UploadDealcsv();
parseCsv.getCsv();
