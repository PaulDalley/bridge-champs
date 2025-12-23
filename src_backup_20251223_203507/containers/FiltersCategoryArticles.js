import React, { Component, useState, useEffect } from "react";
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
import { withRouter } from "react-router-dom";
import "./Filters.css";

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

import { useSelector, useDispatch } from "react-redux";

// export default connect(
//     ({ filters }) => ({
//       category: filters.category,
//       difficulty: filters.difficulty,
//       searchString: filters.searchString,
//       hide: filters.hide,
//       filterType: filters.filterType,
//     }),
//     {
//       setCategoryFilter,
//       setDifficultyFilter,
//       updateSearchString,
//       resetFilters,
//       hideCompletedQuizzesFilter,
//       setFilterType,
//     }
//   )(Filters);

const FiltersCategoryArticles = (props) => {
  const category = useSelector((state) => state.filters?.category);
  const difficulty = useSelector((state) => state.filters.difficulty);
  const searchString = useSelector((state) => state.filters?.searchString);

  const dispatch = useDispatch();

  const [_category, _setCategory] = useState(category);
  const [_difficulty, _setDifficulty] = useState(difficulty);

  // const [_searchString, _setSearchString] = useState(
  //   searchString === '""' ? "" : searchString
  // );

  const [_searchString, _setSearchString] = useState(searchString);

  const [categories, setCategories] = useState(undefined);

  const _resetFilters = (e) => {
    if (e?.preventDefault) e.preventDefault();
    _setCategory("");
    _setDifficulty("");
    _setSearchString("");
    dispatch(resetFilters());
    setTimeout(() => {
      dispatch(resetFilters());
    }, 250);
  };

  useEffect(() => {
    _resetFilters();
  }, [props?.history?.location?.pathname]);

  useEffect(() => {
    _setCategory(category);
  }, [category]);

  useEffect(() => {
    _setDifficulty(difficulty);
  }, [difficulty]);

  useEffect(() => {
    _setSearchString(searchString);
  }, [searchString]);

  useEffect(() => {
    return () => {
      _resetFilters();
    };
  }, []);

  const handleChange = (e) => {
    switch (e.target.name) {
      case "difficulty":
        dispatch(setDifficultyFilter(e.target.value));
        break;
      // case "category":
      //   dispatch(setCategoryFilter(e.target.value));
      //   break;
      case "searchString":
        dispatch(updateSearchString(e.target.value));
        break;
      //   case "hideCompleted":
      //     this.setState({ hideQuizzesChecked: e.target.checked });
      //     this.props.hideCompletedQuizzesFilter(
      //       e.target.checked,
      //       this.props.quizScores
      //     );
      //     break;
    }
  };

  // console.log(
  //   `--- SEARCHSTRING: ${searchString}, useState SearchString: ${_searchString} ---`
  // );
  // console.log(
  //   `--- SEARCHSTRING: ${difficulty}, useState SearchString: ${_difficulty} ---`
  // );
  // console.log(`--- _searchString === "": ${_searchString === '""'}`);

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
            value={_searchString === '""' ? undefined : _searchString}
            onChange={handleChange}
            placeholder="Search..."
            defaultValue={undefined}
            // defaultValue={""}
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
          value={_difficulty}
          onChange={handleChange}
          options={selectOptions}
          // defaultValue={""}
        >
          <option value="">Select Difficulty</option>
          {[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20,
          ].map((n) => {
            return <option value={n}>Level {n}</option>;
          })}
        </Select>

        {categories && (
          <Select
            // s={3}
            // m={5}
            name="category"
            // type="select"
            // label="Select Category"
            value={_category}
            onChange={handleChange}
            options={selectOptions}
          >
            <option disabled value="">
              Select Category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        )}

        <div className="Filters-item Filters-reset_button" waves="light">
          <div onClick={(e) => _resetFilters(e)}>
            <Icon>refresh</Icon>
            <div className="Filters-reset_text">Reset</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(FiltersCategoryArticles);

// class Filters extends Component {
//   componentDidMount() {
//     if (this.props.filterType !== this.props.page) {
//       this.resetFilters({ preventDefault: () => {} });
//       this.props.setFilterType(this.props.page);
//     }
