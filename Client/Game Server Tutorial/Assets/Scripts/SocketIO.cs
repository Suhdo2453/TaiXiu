using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using WebSocketSharp;

public class SocketIO : MonoBehaviour
{
   private WebSocket ws;
   public TextMeshProUGUI txtSmall;
   public TextMeshProUGUI txtBig;
   public TextMeshProUGUI txtTime;
   public TextMeshProUGUI txtRoundId;
   private round_info round;
   public GameObject dice;
   private void Start()
   {
      dice.SetActive(false);
      ws = new WebSocket("ws://localhost:8080/");
      ws.OnOpen += (sender, e) => Debug.Log("WebSocket opened");
      ws.OnMessage += (sender, e) =>
      {
         Debug.Log(e.Data);
         round = JsonUtility.FromJson<round_info>(e.Data);
      };
      ws.Connect();
   }

   private void Update()
   {
      SetText(round);
   }

   private void OnDestroy()
   {
      ws.Close();
   }

   //{
   //"_id":"6405701ec3269a5b382437f1",
   //"small_money":5049500,
   //"small_players":0,
   //"big_money":1991211,
   //"big_players":10,
   //"counter":2,
   //"result":-1,
   //"dateCreated":"2023-03-06T04:46:22.397Z",
   //"__v":0
   //}
   
   private void SetText(round_info round)
   {
      if(round == null) return;
      txtSmall.text = String.Format("{0:N0}", round.small_money);
      txtBig.text = String.Format("{0:N0}", round.big_money);
      txtTime.text = round.counter.ToString();
      txtRoundId.text = round._id;
      
      dice.SetActive(round.counter == 60);
   }
   
   [System.Serializable]
   public class round_info
   {
      public string _id;
      public int small_money;
      public int big_money;
      public int counter; 
   }
}
