let emptyTable = "<tr><td colspan='6' class='text-center'> No Records Available</td></tr>";
let itemsPerPage = 5;
let currentPage = 0;

$(document).ready(function() {
    loadDataFromLocalStorage();

    $("#uploadImage").change(function() {
        let img = URL.createObjectURL(this.files[0]);
        $("#image").attr("src", img);
    });

    $("#addEmployeeButton").click(function() {
        clearForm();
        $("#dialogBox").modal("show");
    });

    $("#skillAddButton").click(function() {
        let toAdd = $("#skills").val();
        $("#addedItems").append("<li>" + toAdd + " " + '<i class="fa-solid fa-circle-minus removeSkill"></i>' + " " + "</li>");
    });

    $("#addedItems").on("click", ".removeSkill", function() {
        $(this).parent("li").fadeOut();
    })

    $("#save").click(function() {
        if ($("#valueId").val() == "") {
            const newEmployee = addEmployeeDataAsObject();
            addEmployee(newEmployee);
        } else {
            updateDataFromLocalStorage();
        }
        clearForm();
        loadDataFromLocalStorage();
        $("#dialogBox").modal("hide");
    });

    $("#employeeTable").on("click", ".btn_delete", function() {
        const id = $(this).parents("tr").find(".firstName").attr("data-id");
        sweetDelete(id);
    });

    $("#displayEmployees").on("click", ".btn_edit", function() {
        const id = $(this).parents("tr").find(".firstName").attr("data-id");
        let employee = getEmployeeById(id);
        $("#firstName").val(employee.firstName);
        $("#lastName").val(employee.lastName);
        $("#email").val(employee.email);
        $('input[name="gender"]:checked').val();
        $("#dob").val(employee.dob);
        $("#joiningDate").val(employee.joiningDate);
        $("#designation").val(employee.designation);
        $("#skills").val(employee.skills);
        $("#description").val(employee.description);
        $("#valueId").val(id);
        $("#save").text("Save");
        $("#addEmployeeHeading").text("Update Employee");
        $("#save").text("Update");
        $("#dialogBox").modal("show");
    });

    $('#searchButton').click(function() {
        searching();
    });

    $("th").click(function() {
        let column = $(this).index();
        sortTable(column);
    });

    $(document).on("click", ".expand", function() {
        $(this).closest("tr").next(".child-table").toggle();
        let iconChange = $(".expand");
        if (iconChange.hasClass("fa-angle-up")) {
            iconChange.toggleClass("fa-angle-up fa-angle-down");
        } else {
            iconChange.toggleClass("fa-angle-up fa-angle-down");
        }
    });

    paginate();
});

function addEmptyTable() {
    if ($("#displayEmployees").children().length == 0) {
        $("#displayEmployees").append(emptyTable);
    }
}

function clearForm() {
    $(":input", "#dialogBox").val("");
    $('input[name="gender"]').prop("checked", false);
    $("#addedItems").empty();
}

function addEmployeeDataAsObject() {
    const newEmployee = {
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        email: $("#email").val(),
        date: $("#dob").val(),
        joiningDate: $("#joiningDate").val(),
        gender: $('input[name="gender"]').prop('checked', true),
        designation: $("#designation").val(),
        image: $("#image").attr('src'),
        skills: $("#addedItems li").append(",").text(),
        description: $("#description").val(),
    };
    return newEmployee;
}

function loadDataFromLocalStorage(data = null) {
    let localEmployees = [];
    if (data != null) {
        localEmployees = data;
    } else {
        localEmployees = getAllEmployees();
    }
    if (localEmployees) {
        $("#displayEmployees").html("");
        localEmployees.forEach((element) => {
            employeeInfo = "<tr class='main-row'>";
            employeeInfo += "<td id='expandRow'>" + '<i id="expand" class="fa-solid fa-angle-down expand"></i>' + "</td>";
            employeeInfo += "<td class='firstName'  data-id=" + element.id + ">" + element.firstName + " " + element.lastName + "</td>";
            employeeInfo += "<td class='mail'>" + element.email + "</td>";
            employeeInfo += "<td class='designation'>" + element.designation + "</td>";
            employeeInfo += "<td class='gender'>" + element.gender + "</td>";
            employeeInfo += "    <td>";
            employeeInfo += "        <a id='btnEdit" + element.id + "' class='btn btn_edit'>" + '<i class="fa-solid fa-pencil"></i>' + "</a>";
            employeeInfo += "        <a id='btnDelete" + element.id + "' class='btn btn_delete'>" + '<i class="fa-solid fa-trash"></i>' + "</a>";
            employeeInfo += "    </td>";
            employeeInfo += " </tr>";
            employeeInfo += "<tr class = 'child-table'>";
            employeeInfo += "<th>Info</th>";
            employeeInfo += "<td class= 'dob'>DOB:" + " " + element.dob + "</td>";
            employeeInfo += "<td class= 'joiningDate'>DOJ:" + " " + element.joiningDate + "</td>";
            employeeInfo += "<td class= 'skills'>Skills: " + element.skills + "</td>";
            employeeInfo += "<td class= 'description'>Description: " + element.description + "</td>";
            employeeInfo += "<td class= 'description'></td>";
            employeeInfo += "</tr>";
            $("#employeeTable").append(employeeInfo);
        });
    }
    addEmptyTable();
}

function updateDataFromLocalStorage() {
    let employeesData = getAllEmployees();
    const pastInfo = employeesData.find((x) => x.id == $("#valueId").val());
    pastInfo.firstName = $("#firstName").val();
    pastInfo.lastName = $("#lastName").val();
    pastInfo.email = $("#email").val();
    pastInfo.dob = $("#dob").val();
    pastInfo.joiningDate = $("#joiningDate").val();
    pastInfo.gender = $('input[name="gender"]:checked').val();
    pastInfo.designation = $("#designation").val();
    pastInfo.skills = $("#addedItems li").append(",").text();
    pastInfo.description = $("#description").val();
    addEmployeeData(employeesData);
}

function searching() {
    const keyword = $('#searchBar').val();
    const data = getAllEmployees();
    const result = data.filter(function(item) {
        return item.firstName.toLowerCase().includes(keyword.toLowerCase());
    });
    loadDataFromLocalStorage(result);
}

function sortTable() {
    let rows = $("tbody .main-row");
    rows.sort(function(a, b) {
        let A = $(a).children("td").text().toUpperCase();
        let B = $(b).children("td").text().toUpperCase();
        if (A < B) {
            return -1;
        }
        if (A > B) {
            return 1;
        }
        return 0;
    });
    $("tbody").empty();
    $.each(rows, function(_index, row) {
        $("tbody").append(row);
    });
}

function paginate() {
    const employees = getAllEmployees();
    $('#employeeTable').pagination({
        dataSource: employees,
        pageSize: 5,
        callback: function(data, pagination) {
            loadDataFromLocalStorage(data)
        }
    });
}