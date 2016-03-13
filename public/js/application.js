function createElement(name){
 return function(){
  return m.apply(null,[name,...arguments])
 }
};
function createElementWithClass(name,klass){
 return function(){
  return m.apply(null,[name,{class: klass},...arguments])
 }
};
var tr = createElement('tr')
var td = createElement('td')
var div = createElement('div')
var hr = createElement('hr')
var divTitle = createElementWithClass('div',"title")
var h2NoMargin = createElementWithClass('h2',"title")
Table={
  controller:function(){
  var ctrl = {};

  ctrl.resume = null;
  
  ctrl.onclick = function(){
    var file, fr,resume;
    if (typeof window.FileReader !== 'function') {
      alert("The file API isn't supported on this browser yet.");
      return;
    }
    
    file = document.getElementById("upload_file").files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
    function receivedText(e) {
      m.startComputation();

      lines = e.target.result;
      resume = JSON.parse(lines);
      
      ctrl.resume = resume;

      m.endComputation();
    }
  };

  return ctrl;


  },
  view:function(ctrl){
    var resume = ctrl.resume;
    console.log(Boolean(resume))
    if (resume)
      return m('div', form(),table());
    return m('div', form());

    function form(){
      return m('form', {enctype:"multipart/form-data", method:"post"},
        m('fieldset', [
          m('legend', 'Upload Your Resume'),
          m('input', {type:'file', accept:'.json', id: 'upload_file'}),
          m('input', {type:'button', value: 'load', onclick: ctrl.onclick}),
        ])
      )
    }

    function table(){

      return [
      div(
        h2NoMargin('Contact Info'),
        hr(),
        div('Name: '+resume.contact_info.name),
        div('Address: '+formatAddress(resume.contact_info.address)),
        div('Phone: '+resume.contact_info.phone),
        div('Email: '+resume.contact_info.email),
        div('Github: ',m('a',{href:resume.contact_info.github},resume.contact_info.github)),
        div('LinkedIn: ',m('a',{href:resume.contact_info.linkedIn},resume.contact_info.linkedIn))),
        
      div(
        h2NoMargin('Summary'),
        hr(),
        div(resume.summary)),
      
      div(
        h2NoMargin('Working Experience'),
        hr(),
        resume.experience ? resume.experience.map(experienceRow) : ""),
      
      div(
        h2NoMargin('Education'),
        hr(),
        resume.education ? resume.education.map(educationRow) : ""),
      
      div(
        h2NoMargin('Additional Skill'),
        hr(),
        resume.additional_skill.map(addListRow))
      ];
    }

    function addListRow(entry,index){
      if (!entry)
        return ""
      return m('li',entry)
    }
    function experienceRow(entry,index){
       return [
                div('Title: '+entry.title),
                div('Company:'+entry.company),
                div('Start Date:'+entry.start_date),
                div('End Date:'+entry.end_date),
                div('Description: '),
                m('ul',entry.description.map(addListRow)),
                m('br')
              ]
      }
    function educationRow(entry,index){
      return [
              div('School:'+entry.school),
              div('GPA:'+entry.gpa),
              div('Start Date:'+entry.start_date),
              div('End Date:'+entry.end_date),
              div('Major:'+entry.major)
            ]
    }
   
    function formatAddress(address){
      return address.street + ' ' + address.postcode + ' ' + address.city + ' ' + address.state + ' ' + address.country
    }
  }
}

m.mount(document.getElementById('resume-table'),Table);
