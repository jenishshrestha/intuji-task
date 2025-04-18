import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import {
  DataTypes,
  removePlayerData,
  setPlayerData,
} from "./player-management/pmSlice";

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
  const playersData = useAppSelector((state) => state.playerData.data);

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
