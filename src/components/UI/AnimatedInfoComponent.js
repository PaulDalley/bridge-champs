import React from 'react';
import "./AnimatedInfoComponent.css";

export const AnimatedInfoComponent = ({closeHandler}) => (
        <div style={{position: 'relative'}}>
            <div className="HomePage-details-card AnimatedInfoComponent-container">
                {/*<div style={{*/}
                    {/*position: 'absolute',*/}
                    {/*// float: 'right',*/}
                    {/*// width: "100%",*/}
                    {/*right: '1.5rem',*/}
                    {/*top: '1.5rem',*/}
                    {/*fontSize: '2rem',*/}
                    {/*cursor: "pointer",*/}
                {/*}}*/}
                     {/*className="AnimatedInfoComponent AnimatedInfoComponent-7"*/}
                     {/*onClick={() => closeHandler() }*/}
                {/*>*/}
                    {/*<i className="material-icons"*/}
                       {/*style={{fontSize: "4.5rem", fontWeight: 'bold'}}>*/}
                        {/*close</i>*/}
                    {/*<br/>*/}
                    {/*CLOSE*/}
                {/*</div>*/}


                <div className="PremiumMembership-row HomePage-row AnimatedInfoComponent AnimatedInfoComponent-1">
                    <div className="PremiumMembership-text-row">
                        <div className="HomePage-card_symbol_marker">♠</div>
                        <span className="PremiumMembership-text-row">
                                    Our analysis is sourced from carefully selected World Class experts competing at the highest level.
                                </span></div>
                </div>
                <div className="PremiumMembership-row HomePage-row">
                    <div className="PremiumMembership-text-row AnimatedInfoComponent AnimatedInfoComponent-2">
                        <div className="HomePage-card_symbol_marker red-suit">♥</div>
                        <span className="PremiumMembership-text-row">
                                Follow Ish and Ashley through major World Championship events as they share their ideas on winning Bridge.
                                </span></div>
                </div>
                <div className="PremiumMembership-row HomePage-row">
                    <div className="PremiumMembership-text-row AnimatedInfoComponent AnimatedInfoComponent-3">
                        <div className="HomePage-card_symbol_marker red-suit">♦</div>
                        <span className="PremiumMembership-text-row">

                                    <strong>Practical and easy</strong> insights that you can use tomorrow at the Bridge table.
                                </span></div>
                </div>
                <div className="PremiumMembership-row HomePage-row">
                    <div className="PremiumMembership-text-row AnimatedInfoComponent AnimatedInfoComponent-4">
                        <div className="HomePage-card_symbol_marker">♣</div>
                        <span className="PremiumMembership-text-row">

                                    Content sorted by difficulty, perfect for both the beginner and expert.</span></div>
                </div>
                <div className="PremiumMembership-row HomePage-row">
                    <div className="PremiumMembership-text-row AnimatedInfoComponent AnimatedInfoComponent-5">
                        <div className="HomePage-card_symbol_marker">♠</div>
                        <span className="PremiumMembership-text-row">
                                        Fun daily quizzes to test your knowledge.</span></div>
                </div>
                <div className="PremiumMembership-row HomePage-row">
                    <div className="PremiumMembership-text-row AnimatedInfoComponent AnimatedInfoComponent-6">
                        <div className="HomePage-card_symbol_marker red-suit">♥</div>
                        <span className="PremiumMembership-text-row">
                                        Lots of fresh content added every week.</span></div>
                </div>
            </div>
        </div>);
