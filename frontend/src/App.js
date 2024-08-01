import React,{useEffect, useState, Component} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './Home';
import LogIn from './logIn.js';
import CreateAccount from './CreateAccount.js';
import SchedulingAppt from './schedulingAppt.js';
import ViewMedHist from './ViewMedHist.js';
import DocHome from './DocHome.js';
import ViewOneHistory from './ViewOneHistory.js';
import Settings from './Settings.js';
import DocSettings from './DocSettings.js';
import PatientsViewAppt from './PatientsViewAppt.js';
import NoMedHistFound from './NoMedHistFound.js';
import DocViewAppt from './DocViewAppt.js';
import MakeDoc from './MakeDoc.js';
import Diagnose from './Diagnose.js';
import ShowDiagnoses from './ShowDiagnoses.js';
import ChatBot, { Loading } from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';

class DBPedia extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: '',
      trigger: false,
    };

    this.triggetNext = this.triggetNext.bind(this);
  }

componentWillMount() {
  const self = this;
  const { steps } = this.props;
  const search = steps.search.value;
  const endpoint = 'https://dbpedia.org/sparql';
  const query = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?comment WHERE {
      ?x rdfs:label "${search}"@en .
      ?x rdfs:comment ?comment .
      FILTER (lang(?comment) = 'en')
    } LIMIT 1
  `;
  const queryUrl = `${endpoint}?query=${encodeURIComponent(query)}&format=json`;

  const xhr = new XMLHttpRequest();

  xhr.addEventListener('readystatechange', readyStateChange);

  function readyStateChange() {
    if (this.readyState === 4) {
      const data = JSON.parse(this.responseText);
      const bindings = data.results.bindings;
      if (bindings && bindings.length > 0) {
        self.setState({ loading: false, result: bindings[0].comment.value });
      } else {
        self.setState({ loading: false, result: 'Not found.' });
      }
    }
  }

  xhr.open('GET', queryUrl);
  xhr.send();
}



  triggetNext() {
    this.setState({ trigger: true }, () => {
      this.props.triggerNextStep();
    });
  }

  render() {
    const { trigger, loading, result } = this.state;

    return (
      <div className="dbpedia">
        { loading ? <Loading /> : result }
        {
          !loading &&
          <div
            style={{
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            {
              !trigger &&
              <button
                onClick={() => this.triggetNext()}
              >
                Search Again
              </button>
            }
          </div>
        }
      </div>
    );
  }
}

DBPedia.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
};

DBPedia.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
};

const steps = [
  {
    id: '1',
    message: 'Welcome to the Hospital Information System! What would you like to know about?',
    trigger: '2',
  },
  { id: '2',
  options: [
      { value: 'first_aid', label: 'First Aid', trigger: 'first_aid_info' },
      { value: 'medication', label: 'Medication Information', trigger: 'medication_info' },
      { value: 'hospital', label: 'Hospital Details', trigger: 'hospital_info' },
    ],
  },
  {
    id: 'first_aid_info',
    message: 'What kind of first aid information are you looking for?',
    trigger:'300',
  },
  { id: '300',
  options: [
      { value: 'wounds', label: 'Treating Wounds', trigger: 'wound_care' },
      { value: 'cpr', label: 'CPR Instructions', trigger: 'cpr_info' },
      { value: 'back_to_main', label: 'Back to Main Menu', trigger: '1' },
    ],
  },
  {
    id: 'wound_care',
    message: 'For minor wounds, clean the area with water and apply a bandage. Seek medical attention for serious wounds. Do not attempt to remove objects if they are embedded in the skin or a deep wound. ',
    trigger: 'first_aid_info',
  },
  {
    id: 'cpr_info',
    message: 'CPR (Cardiopulmonary Resuscitation): Life-saving technique for people who are not breathing or whose heart has stopped. Focuses on chest compressions (push hard, push fast) at a rate of 100-120 per minute. If trained, you can give rescue breaths after every 30 compressions. ',
    trigger: 'cpr_info1',
  },
    {
    id: 'cpr_info1',
    message: 'Here is how to perform CPR: Call emergency services immediately. Lay the person on a flat surface. Push down hard and fast on the center of the chest (breastbone) at least 2 inches deep. Continue chest compressions until help arrives.',
    trigger: 'first_aid_info',
  },
  {
    id: 'medication_info',
    message: 'This is for informational purposes only. Never take medication without consulting a doctor.',
    trigger: 'medication_question',
  },
  {
    id: 'medication_question',
    message: 'Do you have a specific medication in mind, or a general question about medication use?',
    trigger: '4',
  },
  {
    id: '4',
    options: [
      { value: 'specific_med', label: 'Ask about a specific medication', trigger: 'ask_med_name' },
      { value: 'general_info', label: 'General Information about Medication', trigger: 'general_med_info' },
      { value: 'back_to_main', label: 'Back to Main Menu', trigger: '1' },
    ],
    },
  {
    id: 'ask_med_name',
    message: 'Enter the medicine name you want to know more about.',
    trigger: 'search',
  },
  {
        id: 'search',
        user: true,
        trigger: '3',
      },
      {
        id: '3',
        component: <DBPedia />,
        waitAction: true,
        trigger: 'medication_question',
      },
  {
    id: 'general_med_info',
    message: 'Your diagnosis information is stored under View Appointments -> Diagnosis. Always follow the doctor\'s instructions for taking medication. Store medication safely and dispose of it properly. Never share medication with others.',
    trigger: 'medication_question',
  },
  {
    id: 'hospital_info',
    message: 'What information would you like to know about the hospital?',
    trigger: '50',
  },
  {
    id: '50',
    options: [
      { value: 'amenities', label: 'Amenities', trigger: 'amenities' },
      { value: 'departments', label: 'Departments', trigger: 'departments' },
      { value: 'back_to_main', label: 'Back to Main Menu', trigger: '1' },
    ],
  },
  {
    id: 'amenities',
    message: 'We provide a range of amenities such as: Free parking, WiFi, ATM, Cafeteria, Gift shop, Family waiting area',
    trigger: 'hospital_info',
  },
  {
    id: 'departments',
    message: 'Clinical Departments: Cardiology: Heart conditions, Emergency Medicine: Urgent care and critical situations, Endocrinology: Hormone disorders,',
    trigger: 'hosp2',
  },
  {
    id: 'hosp2',
    message: 'Gastroenterology: Digestive system disorders, General Surgery: Performs various surgical procedures, Nephrology: Kidney diseases,',
    trigger: 'hosp3',
  },
  {
    id: 'hosp3',
    message: 'Neurology: Nervous system disorders, Obstetrics & Gynecology: Women\'s health, pregnancy, childbirth, Oncology: Cancer treatment,',
    trigger: 'hosp4',
  },
   {
    id: 'hosp4',
    message: 'Orthopedics: Bones, joints, and muscles, Otolaryngology (ENT): Ear, nose, and throat conditions, Pathology: Analyzes tissues and body fluids for diagnosis,',
    trigger: 'hosp5',
  },
  {
    id: 'hosp5',
    message: 'Pediatrics: Care for infants, children, and adolescents, Pulmonology: Lungs and respiratory system, Radiology: Imaging tests (X-ray, CT scan, MRI), Urology: Urinary tract and male reproductive system',
    trigger: 'hospital_info',
  },
];




// Creating our own theme
const theme = {
  background: '#FFFFFF', // White background
  headerBgColor: '#000000', // Black header background
  headerFontSize: '20px',
  botBubbleColor: '#333333', // Dark gray bot bubble color
  headerFontColor: '#FFFFFF', // White header font color
  botFontColor: '#FFFFFF', // White bot font color
  userBubbleColor: '#CCCCCC', // Light gray user bubble color
  userFontColor: '#000000', // Black user font color
};
// Set some properties of the bot
const config = {
	floating: true,
};

export default function App() {
  let [component, setComponent] = useState(<LogIn />)
  useEffect(()=>{
    fetch("http://localhost:3001/userInSession")
      .then(res => res.json())
      .then(res => {
      let string_json = JSON.stringify(res);
      let email_json = JSON.parse(string_json);
      let email = email_json.email;
      let who = email_json.who;
      if(email === ""){
        setComponent(<LogIn />)
      }
      else{
        if(who==="pat"){
          setComponent(<Home />)
        }
        else{
          setComponent(<DocHome />)
        }
      }
    });
  }, [])
  return (
    <Router>
    <div className="App">
			<ThemeProvider theme={theme}>
				<ChatBot
                    speechSynthesis={{ enable: true, lang: 'en' }}
					headerTitle="Hospital ChatBot"
					steps={steps}
					{...config}

				/>
			</ThemeProvider>
	</div>
      <div>
        <Switch>
          <Route path="/NoMedHistFound">
            <NoMedHistFound />
          </Route>
          <Route path="/MakeDoc">
            <MakeDoc />
          </Route>
          <Route path="/Settings">
            <Settings />
          </Route>
          <Route path="/MedHistView">
            <ViewMedHist />
          </Route>
          <Route path="/scheduleAppt">
            <SchedulingAppt />
          </Route>
          <Route path="/showDiagnoses/:id" render={props=><ShowDiagnoses {...props} />} />
          <Route path="/Diagnose/:id" render={props=><Diagnose {...props} />} />
          <Route name="onehist" path="/ViewOneHistory/:email" render={props=><ViewOneHistory {...props} />}/>
          <Route path="/Home">
            <Home />
          </Route>
          <Route path="/createAcc">
            <CreateAccount />
          </Route>
          <Route path="/DocHome">
            <DocHome />
          </Route>
          <Route path="/PatientsViewAppt">
            <PatientsViewAppt />
          </Route>
          <Route path="/DocSettings">
            <DocSettings />
          </Route>
          <Route path="/ApptList">
            <DocViewAppt />
          </Route>
          <Route path="/">
            {component}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}