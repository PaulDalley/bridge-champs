import React from 'react';
import {CardPanel} from 'react-materialize';
import './TournamentListItem.css';
import {makeDateString} from '../../helpers/helpers';

const TournamentListItem = ({
                                tournamentName,
                                clickHandler,
                                tournamentStartDate,
                                tournamentEndDate,
                                tournamentLogo,
                            }) => {
    // console.log(articles);

    // let articlesJSX = articles.map(article => (
    //     <li>{article.title}</li>
    // ));
    let startDateStr;
    let endDateStr;
    if (tournamentStartDate) {
        startDateStr = makeDateString(tournamentStartDate);
    }
    if (tournamentEndDate) {
        endDateStr = makeDateString(tournamentEndDate);
    }

    return (
        <div onClick={(e) => clickHandler(e, tournamentName)}
             className="ArticlesListItem-div_wrapper">
            <CardPanel
                // onClick={() => }
                className="TournamentListItem-container grey lighten-4 black-text"
                key={tournamentName}>

                <div className="TournamentListItem-name">{tournamentName}</div>

                { tournamentLogo &&
                <div>
                    <br/>
                    <br/>
                    <br/>
                    <img src={tournamentLogo}
                         className="TournamentListItem-logo"/>
                </div>
                }

                {startDateStr && endDateStr &&
                <div className="ArticleListItem-created_at">{startDateStr} - {endDateStr}</div>
                }
                {startDateStr && !endDateStr &&
                <div className="ArticleListItem-created_at">{startDateStr}</div>
                }
            </CardPanel>

        </div>
    );
};

export default TournamentListItem;