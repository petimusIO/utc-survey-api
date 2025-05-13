const survey_dev_data = {
	"total_questions": 7,
	"questions": [
		{
			"question_type": "multiple_choice",
			"question": "Hello World",
			"answers": [
				"I am Zai",
				"You are Zai",
				"We are Zai",
				"No one is Zai"
			]
		}
	]
}
let survey_data = {}
const setUpSurvey = async(data, dev_data) => {
    const survey_data = await data;
    if (survey_data === undefined){
        return dev_data
    }
    return survey_data
}

module.exports = {
    get : (req, res) => {
        res.send("Welcome to the API Page!");
    },
    getQuestions: (req, res) => {
        if (JSON.stringify(survey_data) === "{}" ){
            res.send("No data given!");
        }
        else{
            res.json(survey_data);
        }
    },
    createSurvey : async (req, res) => {
        const survey = await setUpSurvey(req.body, survey_dev_data)
        console.log("\n\nThis is what I am sending back:",survey);
        survey_data = survey;
        res.json(survey);
        
    }
}