import React, { Component } from "react";
import {
  Row,
  Select,
  Checkbox,
  Icon,
  Button,
  Col,
  TextInput,
} from "react-materialize"; // Input deprecated
import { categoriesRef } from "../firebase/config";
import {
  setCategoryFilter,
  setDifficultyFilter,
  updateSearchString,
  resetFilters,
  hideCompletedQuizzesFilter,
  setFilterType,
} from "../store/actions/filtersActions";
import { connect } from "react-redux";

import "./Filters.css";
// <Icon>sort</Icon>
// FROM filtersReducer, default:
//     category: '""',
//     difficulty: '""',
//     searchString: '""',
//     hide: true,

const selectOptions = {
  classes: "",
  dropdownOptions: {
    alignment: "left",
    autoTrigger: true,
    closeOnClick: true,
    constrainWidth: true,
    coverTrigger: true,
    hover: false,
    inDuration: 150,
    onCloseEnd: null,
    onCloseStart: null,
    onOpenEnd: null,
    onOpenStart: null,
    outDuration: 250,
  },
};

class Filters extends Component {
  state = {
    // category: "",
    // difficulty: "",
    // searchString: "",
    // hideQuizzesChecked: true,
    category: this.props.category,
    difficulty: this.props.difficulty,
    searchString:
      this.props.searchString === '""' ? "" : this.props.searchString,
    hideQuizzesChecked: this.props.hide,
    categories: undefined,
  };

  resetFilters = (e) => {
    e.preventDefault();
    this.setState({
      category: "",
      difficulty: "",
      searchString: "",
      // hideQuizzesChecked: true,
    });
    this.props.resetFilters();

    setTimeout(() => {
      this.props.resetFilters();
    }, 1000);
  };

  componentDidMount() {
    if (this.props.filterType !== this.props.page) {
      this.resetFilters({ preventDefault: () => {} });
      this.props.setFilterType(this.props.page);
    }

    if (this.props.page === "articles") {
      // categoriesRef.onSnapshot(snapshot => {
      //     if (snapshot && snapshot.docs.length > 0) {
      //         const categories = snapshot.docs.map(doc => doc.id);
      //         // console.log(categories);
      //         this.setState({categories});
      //     }
      // });
      categoriesRef.get().then((snapshot) => {
        if (snapshot && snapshot.docs.length > 0) {
          const categories = snapshot.docs.map((doc) => doc.id);
          // console.log(categories);
          this.setState({ categories });
        }
      });
    }
  }

  // componentWillReceiveProps(nextProps) {
  //     console.log(nextProps.filterType);
  //     console.log(this.props.page);
  //     if (nextProps.filterType !== this.props.page) {
  //         this.props.setFilterType(this.props.page);
  //         this.resetFilters({ preventDefault: () => {}});
  //     }
  // }

  handleChange = (e) => {
    switch (e.target.name) {
      case "difficulty":
        this.props.setDifficultyFilter(e.target.value);
        break;
      case "category":
        this.props.setCategoryFilter(e.target.value);
        break;
      case "searchString":
        this.props.updateSearchString(e.target.value);
        break;
      case "hideCompleted":
        // console.log(e.target.checked);
        // console.log(this.props.quizScores);
        this.setState({ hideQuizzesChecked: e.target.checked });
        this.props.hideCompletedQuizzesFilter(
          e.target.checked,
          this.props.quizScores
        );
        break;
    }
    // console.log(e.target.name);
    // console.log(e.target.value);

    // this.setState({[e.target.name]: e.target.value});
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.category !== nextProps.category) {
      this.setState({ category: nextProps.category });
    }
    if (this.state.difficulty !== nextProps.difficulty) {
      this.setState({ difficulty: nextProps.difficulty });
    }
    if (this.state.hideQuizzesChecked !== nextProps.hide) {
      this.setState({ hideQuizzesChecked: nextProps.hide });
    }
    if (this.state.searchString !== nextProps.searchString) {
      let newSearchString =
        nextProps.searchString === '""' ? "" : nextProps.searchString;
      this.setState({ searchString: newSearchString });
    }
  }

  // componentWillUnmount() {
  // this.props.resetFilters();
  // }

  render() {
    return (
      <div className="Filters-container">
        <div>
          <div className="Filters-search_input_container Filters-item">
            <div className="Filters-search_input_icon">
              <Icon>search</Icon>
            </div>

            <TextInput
              className="Filters-search_input"
              name="searchString"
              value={this.state.searchString}
              onChange={this.handleChange}
              placeholder="Search..."
              // className="PremiumMembership-token-input-box"
              // style={{height: '3.7rem', position: 'relative', left: '0'}}
            ></TextInput>
          </div>
        </div>
        <div className="Filters-select_inputs">
          <Select
            // s={3}
            // m={5}
            name="difficulty"
            // type="select"
            // label="Select Difficulty"
            value={this.state.difficulty}
            onChange={this.handleChange}
            options={selectOptions}
          >
            <option value="">Select Difficulty</option>
            <option value="general">General</option>
            <option value="beg">Improver</option>
            <option value="int">Intermediate</option>
            <option value="adv">Advanced</option>
          </Select>

          {this.state.categories && (
            <Select
              // s={3}
              // m={5}
              name="category"
              // type="select"
              // label="Select Category"
              value={this.state.category}
              onChange={this.handleChange}
              options={selectOptions}
            >
              <option value="">Select Category</option>
              {this.state.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          )}

          {this.props.page === "quizzes" && (
            <Select
              // s={3}
              // m={5}
              name="category"
              type="select"
              // label="Select Quiz Type"
              value={this.state.category}
              onChange={this.handleChange}
              options={selectOptions}
            >
              <option value="">Select Quiz Type</option>
              <option value="Bidding">Bidding</option>
              {/*<option value='Defence'>Defence</option>*/}
              {/*<option value='Declaring'>Declaring</option>*/}
              <option value="Opening Lead">Opening Lead</option>
            </Select>
          )}
          {/*<Icon*/}
          {/*onClick={(e) => this.resetFilters(e)}*/}
          {/*style={{ position: 'relative', top: '.5rem', left: '.5rem'}}*/}
          {/*>*/}
          {/*refresh*/}
          {/*</Icon>*/}
          {/*<div className="Filters-item Filters-Reset">*/}
          {this.props.page !== "quizzes" && (
            <div className="Filters-item Filters-reset_button" waves="light">
              <div onClick={(e) => this.resetFilters(e)}>
                <Icon>refresh</Icon>
                <div className="Filters-reset_text">Reset</div>
              </div>
            </div>
          )}

          {this.props.page === "quizzes" && (
            <div
              className="Filters-item Filters-reset_button_quiz"
              waves="light"
            >
              <div
              // style={{ position: "absolute", left: "1.25rem", top: "6.5rem" }}
              >
                <Checkbox
                  id="hideCompleted"
                  name="hideCompleted"
                  value={this.state.hideQuizzesChecked}
                  //    type='checkbox'
                  // label="Hide Completed"
                  checked={this.state.hideQuizzesChecked}
                  onChange={this.handleChange}
                  style={{ zIndex: 26001 }}
                />
                <span className="Filters-checkbox_label">Hide Completed</span>
              </div>
              <div onClick={(e) => this.resetFilters(e)}>
                <Icon>refresh</Icon>
                <div className="Filters-reset_text">Reset</div>
              </div>
            </div>
          )}

          {/*</div>*/}
        </div>
      </div>
    );
  }
}

//     category: '""',
//     difficulty: '""',
//     searchString: '""',
//     hide: true,

export default connect(
  ({ filters }) => ({
    category: filters.category,
    difficulty: filters.difficulty,
    searchString: filters.searchString,
    hide: filters.hide,
    filterType: filters.filterType,
  }),
  {
    setCategoryFilter,
    setDifficultyFilter,
    updateSearchString,
    resetFilters,
    hideCompletedQuizzesFilter,
    setFilterType,
  }
)(Filters);

// export default connect(
//     ({ filters }) => {
//         console.log(filters);
//         return {
//             category: filters.category,
//             difficulty: filters.difficulty,
//             searchString: filters.searchString,
//             hide: filters.hide,
//             filterType: filters.filterType,
//         }
//     },
//     {setCategoryFilter, setDifficultyFilter, updateSearchString, resetFilters, hideCompletedQuizzesFilter, setFilterType}
// )
// (Filters);
