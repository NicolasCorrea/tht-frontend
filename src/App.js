import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import "./App.css";
import axios from "axios";
import CurrencyFormat from "react-currency-format";

const columnsModal = [
  {
    title: "Nombre",
    dataIndex: "Name",
    key: "OrderItemId",
  },
  {
    title: "Precio",
    dataIndex: "PaidPrice",
  },
];

const App = () => {
  const [data, setData] = useState();
  const [modalInfo, setModalInfo] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const columns = [
    {
      title: "Cedula",
      dataIndex: "NationalRegistrationNumber",
      key: "NationalRegistrationNumber",
    },
    {
      title: "Nombre",
      dataIndex: "CustomerFirstName",
      render(value, row) {
        return row.CustomerFirstName + " " + row.CustomerLastName;
      },
    },
    {
      title: "Correo",
      render(row) {
        return row.AddressBilling.CustomerEmail;
      },
    },
    {
      title: "Telefono",
      render(row) {
        return row.AddressBilling.Phone || row.AddressBilling.Phone2;
      },
    },
    {
      title: "Total",
      render(row) {
        return <CurrencyFormat value={row.Price} displayType={'text'} thousandSeparator={true} prefix={'$'} />
      },
    },
    {
      title: "Accion",
      render(row) {
        return <Button onClick={() => showModal(row.OrderId)}>Ver mas</Button>;
      },
    },
  ];
  const getOrders = (setData) => {
    axios.get("http://localhost:3001/getOrders").then((response) => {
      const orders = response.data.SuccessResponse.Body.Orders.Order;
      setData(orders);
      // console.log(response.data.SuccessResponse.Body.Orders.Order);
    });
  };

  const showModal = (orderId) => {
    setIsModalVisible(true);
    axios
      .get("http://localhost:3001/getOrderItem/" + orderId)
      .then((response) => {
        if (
          !Array.isArray(
            response.data.SuccessResponse.Body.OrderItems.OrderItem
          )
        ) {
          setModalInfo([
            response.data.SuccessResponse.Body.OrderItems.OrderItem,
          ]);
        } else {
          setModalInfo(response.data.SuccessResponse.Body.OrderItems.OrderItem);
        }
      });
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  useEffect(() => {
    getOrders(setData);
  }, [setData]);

  return (
    <div className="App">
      <Table dataSource={data} pagination columns={columns} />
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Table dataSource={modalInfo} columns={columnsModal} />
      </Modal>
    </div>
  );
};

export default App;
