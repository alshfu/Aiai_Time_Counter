function new_input(elem, data, class_name, name) {

    const input_tr_date = document.createElement(elem)
    input_tr_date.type = 'text'
    input_tr_date.className = class_name
    input_tr_date.value = data
    input_tr_date.name = name
    return input_tr_date;
}

function create_filter_element() {

    const settings_form = document.getElementById('new_settings_form')
    const new_settings_form = document.createElement('form')
    new_settings_form.method = 'post'
    new_settings_form.action = '/settings/new'

    const save_div = document.createElement('div')

    save_div.className = 'mb-1'
    save_div.style.textAlign = 'end'
    const save_button = document.createElement('button')
    const button_icon = document.createElement('i')
    button_icon.className = 'bi bi-save-fill'
    button_icon.innerText = ' spara '

    save_button.className = 'btn btn-primary'
    save_button.appendChild(button_icon)
    save_button.type = 'submit'


    const new_input_group = document.createElement('div')
    new_input_group.className = 'input-group mb-1'

    const konto_number = new_input(
        'input',
        'data',
        'input-group-text col-sm-1 justify-content-start',
        'konto_n');
    const filter_list = new_input(
        'textarea',
        'data',
        'form-control col-lg justify-content-center',
        'filter_list');
    konto_number.style.height = '38px'
    konto_number.style.color = 'red'

    save_div.appendChild(save_button)

    new_settings_form.appendChild(save_div)
    new_input_group.appendChild(konto_number)
    new_input_group.appendChild(filter_list)
    new_settings_form.appendChild(new_input_group)
    settings_form.appendChild(new_settings_form)

}

function settings() {
    create_filter_element()
    console.log('Пm hire ')

}