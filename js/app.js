/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {

    var studentModel = {
        fetchStudents: function(){
            var students = JSON.parse(localStorage.attendance);
            return students;
        },
        saveStudents:function(object){
            localStorage.attendance = JSON.stringify(object);
        },
        get: function(){
            return this.fetchStudents();
        },
        update: function(array){
            this.saveStudents(array);
        },
    };

    var studentController = {
        init:function(){
            studentView.render();
        },
        getMissedDays: function(studentName){
            var students = studentModel.get();
            var currentStudent = students[studentName];
            return currentStudent.filter(function(obj){
                return obj == false;
            });
        },
        getAllDays: function(studentName){
            var students = studentModel.get();
            var currentStudent = students[studentName];
            return currentStudent;
        },
        updateDay: function(studentName,index,value){
            if(typeof(value) == "boolean"){
                var students = studentModel.get();
                students[studentName][index] = value;
                studentModel.update(students);
            }
        },
        getStudents:function(){
            return studentModel.get();
        },
    };

    var studentView = {
        render: function(){
            var students = studentController.getStudents();
            var studentKeys = Object.keys(students);
            var name ="";
            var trElement = "";
            var nameCol = "";
            var counterCol = "";
            var attendance =""
            this.clearBody();
            for (var i = 0; i < studentKeys.length; i++) {
                //variaveis
                name = studentKeys[i];
                attendanceArray = students[name];
                //cria a tr do estudante
                trElement = document.createElement("tr");
                //cria td com o estudante
                nameCol = document.createElement("td");
                //cria elemento que conta as faltas
                counterCol = document.createElement("td");

                //carrega os elementos
                trElement.classList.add("student");
                nameCol.classList.add("name-col");
                counterCol.classList.add("missed-col");
                nameCol.innerText = name;
                counterCol.innerText = attendanceArray.filter(c=> c==false).length;
                trElement.append(nameCol);
                //percorre o array de presenças do estudante para criar as colunas
                for (var x = 0; x < attendanceArray.length; x++) {
                    attendance = attendanceArray[x];
                    this.createCheckboxColumn(trElement,attendance,name,x);
                }
                trElement.append(counterCol);
                this.appendBody(trElement);
            }
        },
        createCheckboxColumn:function(tr,isChecked,studentName,index){
            var td = document.createElement("td");
            td.classList.add("attend-col");
            td.innerHTML = "<input type='checkbox'>";
            if(isChecked) td.firstChild.checked = true;
            td.firstChild.addEventListener("click",this.checkBoxClick(studentName,index));
            tr.append(td);
        },
        checkBoxClick:function(studentName,index){
            var students = studentController.getStudents();
            return function(e){
                studentController.updateDay(studentName,index,this.checked);
                studentView.render();
            };
        },
        clearBody:function(){
            document.getElementById("tbody").innerHTML = "";
        },
        appendBody: function(elm){
            document.getElementById("tbody").append(elm);
        }

    }

    studentController.init();
}());
