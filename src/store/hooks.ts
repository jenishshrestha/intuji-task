import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import {
  DataTypes,
  removePlayerData,
  setPlayerData,
} from "./player-management/pmSlice";
import {
  removeTeamData,
  setTeamDatas,
  TMTypes,
} from "./team-management/tmSlice";

import {
  GeneratedTeamSet,
  setGeneratedTeam,
} from "./team-generation/generatedTeamsSlice";

/**
 * =============================================================================
 * Fully typed hooks for Redux store
 * @description This file contains custom hooks for dispatching actions and
 * selecting state from the Redux store.
 * =============================================================================
 */

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * =============================================================================
 * Hook to manipulate players data
 * =============================================================================
 */

export const usePlayerData = () => {
  // access current state of data
  const playersData = useAppSelector((state) => state.playerDatas.data);

  // dispatcher to dispatch action
  const dispatch = useAppDispatch();

  //remove player from data and update state
  const removePlayer = (id: number) => {
    dispatch(removePlayerData(id));
  };

  // add/update players data
  const updatePlayer = (data: DataTypes[]) => {
    dispatch(setPlayerData(data));
  };

  return {
    playersData,
    removePlayer,
    updatePlayer,
  };
};

/**
 * =============================================================================
 * Hook to manipulate team data
 * =============================================================================
 */

export const useTeamData = () => {
  // access current state of data
  const teamsDatas = useAppSelector((state) => state.teamDatas.data);

  // dispatcher to dispatch action
  const dispatch = useAppDispatch();

  //remove player from data and update state
  const removeTeam = (id: number) => {
    dispatch(removeTeamData(id));
  };

  // add/update players data
  const updateTeam = (data: TMTypes[]) => {
    dispatch(setTeamDatas(data));
  };

  return {
    teamsDatas,
    removeTeam,
    updateTeam,
  };
};

/**
 * =============================================================================
 * Hook to manipulate generated team data
 * =============================================================================
 */
export const useGeneratedTeams = () => {
  // access data
  const generatedTeamsDatas = useAppSelector(
    (state) => state.generatedTeams.data,
  );

  // dispatcher to dispatch action
  const dispatch = useAppDispatch();

  const generateTeam = (data: GeneratedTeamSet) => {
    dispatch(setGeneratedTeam(data));
  };

  return {
    generatedTeamsDatas,
    generateTeam,
  };
};
