EcoLearnia Interactive Description Language (ELIDS)


Loosely Based on QTi 2.1


Sample:


    {
        "responseDeclarations": {
            "field1": {
                "cardinality": "multiple",
                "baseType": "number",
                "@doc": "This data must be stripped out",
                "correctAnswer": {
                    "field1": {"regex": "2"},
                },
            },
            "field1": {
                "cardinality": "single",
                "baseType": "number"
                "correctAnswer": {
                    "field2": {"expression": "$field2 * $field2 == 4"}
                },
            }
        },
        "outcomeDeclarations": {
            "score": {
                "cardinality": "single",
                "baseType": "number",
                "@doc": "This data must be stripped out",
                "defaultValue": 0,
            }
        },
        "questionDeclarations": {
            "question1": {
                "prompt": "What are the possible answers for square root of 4?",
                "fields": [
                    {
                        "responseId": "field1",
                        "options": [
                            {
                                "key": "2",
                                "value": "Two"
                            },
                            {
                                "key": "3",
                                "value": "Three"
                            },
                            {
                                "key": "4",
                                "value": "Four"
                            },
                            {
                                "key": "-2",
                                "value": "Minus Four"
                            }
                        ]
                    }
                ],
            }
        },

        "responseProcessing": {

            "switch": [
                {
                    "case": { "condition": "incorrect", "field": "field1"},
                    "outcomes": {
                        "feedback": "Incorrect",
                        "field": "field1"
                    }
                },
                {
                    "case": "$field1 > 2",
                    "outcomes": {
                        "field": "field1",
                        "feedback": ""Number too large"
                    }
                },
                {
                    "case": "$field1 == $field2",
                    "outcomes": {
                        "field": "__aggregate__",
                        "feedback": "Fields cannot be same"
                    }
                },
                {
                    "case": "__timeout__",
                    "outcomes": {
                        "field": "__aggregate__",
                        "feedback": "Sorry, timed out"
                    }
                },
                {
                    "case": "__past_duedate__",
                    "outcomes": {
                        "field": "__aggregate__",
                        "feedback": "Due date passed"
                    }
                }
            ]
        },

        "item": {
            "body": {
                html: "HTML markup",
                "componentId": "my_question"
            },
            "components": {
                "my_question": {
                    "type": "TemplateContainer",
                    "config": {
                        "template": "<div>{{.models.question.prompt}}<br /> {{.components.selectquestion}} <br/> ${actionbar} <br/> ${feedback}</div>",
                        "~doc": "Optionally:"
                    }
                },
                "selectquestion": {
                    "type": "ChoiceInteraction",
                    "config": {
                        "question": { "_lref" : ".models.question"},
                        "layout": "flow"
                    }
                },
                "actionbar": {
                    "type": "ActionBar",
                    "config": {
                        "items": [
                            "audio","submission","reset","read","hint"
                        ]
                    }
                },
                "feedback": {
                    "type": "Feedback",
                    "config": {
                        "display": "list",
                        "message": "$feedback"
                    }
                }
            }
        },

        "actions": {
            "solution": "2 * 2 = 4; also -2 * -2 = 4",
            "!doc": "hints is an array in the order that is shown per attemp failure",
            "hints": [
                "What multiplied twice gives 4?",
                "Remember that multiplying two negatives yields positive."
            ]
        },
        "policy": {
            "maxAttempts": 3,
            "!doc": "Optional - if present, each attempt will be timed in seconds",
            "timed": 10,
            "timeOverAction": "action to take when time is over"
        },

    }


    "!doc": "Internal, when student already submited is available",
    "submissions": [
        {
            "timestamp": ISODATE,
            "timeSpent": seconds,
            "score": 1,
            "fields": [
                {
                    "fieldId": 0,
                    "answeredKey": "2",
                    "answeredValue": "Two",
                    "score": 1,
                    "feedback": 'Great'
                },
                { "fieldId": 1, "answeredKey": "-2", "answeredValue": "Minus Two", score: 1 }
            ]
        }
    ]
