const dataTable = "localEmployees";

function get() {
    return localStorage.getItem(dataTable) !== null ? JSON.parse(localStorage.getItem(dataTable)) : [];
}

function getAllEmployees() {
    return get();
}

function add(localEmployees) {
    return localStorage.setItem(dataTable, JSON.stringify(localEmployees));
}

function addEmployeeData(localEmployees) {
    add(localEmployees);
}

function maxId() {
    const localEmployees = get();
    if (localEmployees.length > 0) {
        const ids = localEmployees.map((x) => x.id);
        const max = Math.max.apply(null, ids);
        return max + 1;
    } else {
        return 1;
    }
}

function addEmployee(newEmployee) {
    newEmployee.id = maxId();
    const localEmployees = getAllEmployees();
    localEmployees.push(newEmployee);
    addEmployeeData(localEmployees);
}

function getEmployeeById(id) {
    let employeesData = getAllEmployees();
    let employee = employeesData.find((x) => x.id == parseInt(id));
    return employee;
}

function deleteDataFromLocalStorage(id) {
    let employeesData = get();
    let i = 0;
    while (i < employeesData.length) {
        if (employeesData[i].id === parseInt(id)) {
            employeesData.splice(i, 1);
        } else {
            ++i;
        }
    }
    add(employeesData);
    loadDataFromLocalStorage();
}