using System;
using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

namespace Client_sharp
{
    internal class Program
  {
    public class Booking
    {
      public int HotelId { get; set; }
      public DateTime CheckIn { get; set; }
      public DateTime CheckOut { get; set; }
      public int RoomNo { get; set; }
      public string CustomerName { get; set; }
      public string CustomerEmail { get; set; }
      public string CustomerAddress { get; set; }
    }

    public static void Main(string[] args)
    {
      var factory = new ConnectionFactory() { HostName = "localhost", UserName = "admin", Password = "password"};
      using (var connection = factory.CreateConnection())
      {
        using (var channel = connection.CreateModel())
        {
          channel.QueueDeclare(queue: "Reservations",
            durable: false,
            exclusive: false,
            autoDelete: false,
            arguments: null);

          Booking newBooking = new Booking()
          {
            HotelId = new Random().Next(0, 10),
            CheckIn = DateTime.Now,
            CheckOut = DateTime.Now.AddDays(1),
            CustomerAddress = "Hellostreet 2",
            CustomerEmail = "hello@world.com",
            CustomerName = "Hello World",
            RoomNo = new Random().Next(0, 100),
          };
            
          JsonSerializerOptions options = new JsonSerializerOptions(JsonSerializerDefaults.Web)
          {
            WriteIndented = true,
          };
          
          string message = JsonSerializer.Serialize(newBooking, options);
          Console.WriteLine("Message send:");
          Console.WriteLine(message);
          
          var body = Encoding.UTF8.GetBytes(message);
          
          channel.BasicPublish(exchange: "",
            routingKey: "Reservations",
            basicProperties: null,
            body: body);
          Console.WriteLine(" [x] Sent {0}", message);
        }
      }
      Console.WriteLine(" Press [enter] to exit.");
      Console.ReadLine();
    }
  }
}