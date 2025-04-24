import axios from 'axios';
import {useDispatch} from 'react-redux';
import {ADD_TO_CART, GET_CART_ITEM} from './types';

export default function useCarts() {
    const token = localStorage.getItem("customerToken");
    const config = {
      headers: {Authorization: 'Bearer ${token}' },
    };

    const dispatch = useDispatch();

    const addToCart = (data) => {
        const result = axios.post("/carts/addToCart", data, config).then((res) => {
            return res.data;
        }).catch((err) => {
            return err.response.data;
        })
        return {
            type: ADD_TO_CART,
            payload: result,
        };
    };
    const getCartItems = () => {
        const result = axios.get("/carts", config).then((res) => {
            return res.data;
        }).catch((err) => {
            return err.response.data;
        });

        dispatch({
            type: GET_CART_ITEM,
            payload: result,
        });
    };

    return{
        getCartItems,
        addToCart
    }
}