EcoLearnia Interactive Description Language (ELIDS)

Loosely Based on QTi 2.1

Sample:


    {
        "@doc": "This section declares variables that is assigned with a value",
        "@doc": "at the moment of content instantiation, e.g. before sending to",
        "@doc": "the client. The variables can only be of primitive type.",
        "@doc": "Variables are useful way to reuse content to yielding different",
        "@doc": "questions.",
        "@doc": "In the evaluation expression, it is accessed as var_<varname>.",
        "variableDeclarations": {
            "num1": {
                "baseType": "number",
                "value": 12,
                "minVal": 0,
                "maxVal": 20
            },
            "num2": {
                "baseType": "number",
                "value": 33,
                "minVal": 0,
                "maxVal": 100
            }
        },
        "@doc": "This section declares participant's input fields (submission)",
        "responseDeclarations": {
            "field1": {
                "cardinality": "multiple",
                "baseType": "number",
                "@doc": "correctAnswer is optional and must be stripped out prior sending to client",
                "@doc": "If it is not defined, the responseProcessing should include scoring evaluation",
                "correctAnswer": {
                    "field1": {"regex": "2"}
                }
            },
            "field1": {
                "cardinality": "single",
                "baseType": "number"
                "correctAnswer": {
                    "field2": {"expression": "$field2 * $field2 == 4"}
                }
            }
        },

        "@doc": "This section declares fields returned back to the participant",
        "@doc": "The values are set in the responseProcessing section ",
        "outcomeDeclarations": {
            "@doc": "The following is a ",
            "score": {
                "cardinality": "single",
                "baseType": "number",
                "@doc": "This data must be stripped out",
                "defaultValue": 0
            }
            "@doc": "Following default fields are available:",
            "@doc": "{number:0..1} _aggregate_.score - aggregate score/correctness",
            "@doc": "{string} _aggregate_.feedback -aggregate feedback",
            "@doc": "{number:0..1} <componentId>.score - Component score/correctness",
            "@doc": "{string} <componentId>.feedback - Component feedback"
        },

        "@doc": "This section defines model used by the components.",
        "@doc": "The model can reference fields in the responseDeclarations",
        "modelDefinition": {
            "question2": {
                "@type": "question"
                "prompt": "What is ${num1} + ${num2}?",
                "fields": [
                    {
                        "responseId": "field2",
                        "@doc": "All scoring weight should add up to 1",
                        "@doc": "If not provided, all fields have same distributed weight",
                        "scoringWeight": .5
                    }
                    ]
            "question1": {
                "@type": "question"
                "prompt": "What are all the possible answers for square root of 4?",
                "fields": [
                    {
                        "responseId": "field1",
                        "scoringWeight": .5
                        "options": [
                            {
                                "key": "2",
                                "value": "2"
                            },
                            {
                                "key": "3",
                                "value": "3"
                            },
                            {
                                "key": "-2",
                                "value": "-2"
                            }
                        ]
                    },
                    {
                        "id": "field2",
                        "type": "number",
                        "options": [
                            {
                                "key": "2",
                                "value": "2"
                            },
                            {
                                "key": "4",
                                "value": "4"
                            },
                            {
                                "key": "-2",
                                "value": "-2"
                            }
                        ]
                    }
                ]
            }
        },

        "@doc": "This section handles the submission of the participant.",
        "@doc": "It computes and assigns value to the fields in outcomeDeclarations",
        "responseProcessing": {

            "@doc": "Next block is a 'when' statement. The player is responsible",
            "@doc": "of implementing the statement evaluator",
            "when": [
                {
                    "@doc": "For the meantime, this is the method for init",
                    "case": "true",
                    "then": {
                        "field1.feedback": "Incorrect"
                        "field2.feedback": "Incorrect"
                    }
                },
                {
                    "case": { "condition": "incorrect", "field": "field1"},
                    "then": {
                        "field": "field1"
                        "feedback": "Incorrect",
                    }
                },
                {
                    "@doc": "The following is same as { expression: '$field1 > 2'}",
                    "case": "$field1 > 2",
                    "then": {
                        "field1.score": 0,
                        "field1.feedback": "Number too large"
                    }
                },
                {
                    "case": "$field1 == $field2",
                    "then": {
                        "_aggregate_.feedback": "Fields cannot be same"
                    }
                },
                {
                    "case": "$field1 * $field1 == 4",
                    "then": {
                        "field1.score": 1,
                        "field1.feedback": "Correct"
                    }
                },
                {
                    "case": "$field2 * $field2 == 4",
                    "then": {
                        "field2.score": 1,
                        "field2.feedback": "Correct"
                    }
                },
                {
                    "case": { "condition": "past_due"},
                    "outcomes": {
                        "_aggregate_.feedback": "Due date passed"
                    }
                }
            ]
        },

        "@doc": "This section is defines the structure of this item.",
        "@doc": "Todo: change the name from item to something else.",
        "item": {
            "mainComponent": "my_question",
            "components": {
                "@doc": "Each component has two properties, type and config."
                "my_question": {
                    "type": "TemplateContainer",
                    "config": {
                        "template": "<div>{{.model.question1.prompt}}<br /> {{.components.selectquestion}} <br/> {{actionbar}} <br/> {{feedback}}</div>",
                    }
                },
                "selectquestion": {
                    "type": "ChoiceInteraction",
                    "config": {
                        "question": { "_ref_" : ".model.question"},
                        "@doc": "Optionally the question property may include the",
                        "@doc": "full definition of the question.",
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
                        "@doc": "In the client-side player, this is the path",
                        "@doc": "to the store (Redux)",
                        "messageRef": "_aggregate_.feedback"
                    }
                }
            }
        },

        "@doc": "This section defines the default policy which can be overriden",
        "@doc": "by runtime environment",
        "defaultPolicy": {
            "maxAttempts": 3,
            "@doc": "Optional - if present, each attempt will be timed in seconds",
            "timed": 10,
            "@doc": "If timed is present, following action takes place when time is over",
            "onTimeOver": "autosubmit"
        }

        "@doc": "This section defines custom actions.",
        "@doc": "WARNING: Specification of this section is not final.",
        "actions": {
            "solution": "2 * 2 = 4; also -2 * -2 = 4",
            "@doc": "hints is an array in the order that is shown per attempt failure",
            "hints": [
                "What multiplied twice gives 4?",
                "Remember that multiplying two negatives yields positive."
            ]
        },
    }
