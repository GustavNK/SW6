using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Concurrency.Migrations
{
    public partial class AddDataSeed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "books",
                columns: new[] { "BookId", "Description", "PublishedOn", "Theme", "Title" },
                values: new object[] { 1, "Test", new DateTime(2022, 4, 8, 7, 49, 45, 440, DateTimeKind.Utc).AddTicks(1395), "TestTheme", "TestTitle" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "books",
                keyColumn: "BookId",
                keyValue: 1);
        }
    }
}
