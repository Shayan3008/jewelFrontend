import { combineReducers } from 'redux';
import { actionNames } from '../Actions/GoldRateAction';
import { actionNamesDialog } from '../Actions/MessageDialogAction';

const initialState = {
    goldRate: 0,

};

const inititalDialogState = {
    dialog: false,
    isError: false,
    message: ""
}

const goldRateReducer = (state = initialState, action) => {
    // console.log(action)
    switch (action.type) {
        case actionNames.changeInRate:
            return {
                goldRate: action.rate
            }
        default:
            return state;
    }
};


const dialogMessageReducer = (state = inititalDialogState, action) => {
    switch (action.type) {
        case actionNamesDialog.showDialog:
            return {
                dialog: action.dialog,
                isError: action.isError,
                message: action.message
            }
        default:
            return state
    }
}



const rootReducer = combineReducers({
    goldRateReducer: goldRateReducer,
    dialogMessageReducer: dialogMessageReducer
    // Add more reducers here if needed
});

export default rootReducer;