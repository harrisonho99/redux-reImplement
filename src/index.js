console.clear();

//The magic of Redux  inside createStore function
// I reImplemented the createStore function
const createStore = (reducer) => {
    // check type reducer
    if (typeof reducer !== "function") {
        throw Error("Reducer is required as a function and return state");
    }
    //  init intenal state and listeners from subcribe
    let state;
    let newState;
    let listenerArray = [];
    // init internal  state with dummy action
    state = reducer(undefined, {});

    // setState return copy of state for  prevent mutate the internal state
    const getState = () => {
        return JSON.parse(JSON.stringify(state));
    };
    //subscribe take argguments of functions
    function subscribe() {
        const listOfListener = Array.from(arguments);
        listOfListener.forEach((listener) => {
            if (typeof listener !== "function") {
                throw Error("Listener must be function");
            }
            listenerArray.push(listener);
        });
    }

    //dispatch take action as argument
    const dispatch = (action) => {
        newState = reducer(state, action);
        // compare the ref of newState and internalState
        if (newState !== state) {
            state = newState;
            if (listenerArray.length > 0) {
                // invoke all listener
                listenerArray.forEach((listener) => {
                    listener();
                });
            }
        }
    };

    return {
        getState,
        subscribe,
        dispatch
    };
};

// example using basic redux
const reducer = (state = { value: 0 }, action) => {
    switch (action.type) {
        case "increment":
            return { ...state, value: state.value + 1 };
        case "decrement":
            return { ...state, value: state.value - 1 };
        default:
            return state;
    }
};

const store = createStore(reducer);
const increButton = document.getElementById("increment");
const decreButton = document.getElementById("decrement");
const span = document.querySelector("span");

increButton.onclick = () => {
    store.dispatch({ type: "increment" });
};
decreButton.onclick = () => {
    store.dispatch({ type: "decrement" });
};
store.subscribe(() => {
    span.innerText = store.getState().value;
});
