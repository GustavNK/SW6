using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Concurrency.Migrations
{
    public partial class AddAuthor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "authors",
                columns: table => new
                {
                    AuthorId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ChangeCheck = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_authors", x => x.AuthorId);
                });

            migrationBuilder.InsertData(
                table: "authors",
                columns: new[] { "AuthorId", "Name" },
                values: new object[] { 1, "TestAuthor" });

            migrationBuilder.UpdateData(
                table: "books",
                keyColumn: "BookId",
                keyValue: 1,
                column: "PublishedOn",
                value: new DateTime(2022, 4, 8, 8, 23, 7, 578, DateTimeKind.Utc).AddTicks(7348));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "authors");

            migrationBuilder.UpdateData(
                table: "books",
                keyColumn: "BookId",
                keyValue: 1,
                column: "PublishedOn",
                value: new DateTime(2022, 4, 8, 7, 49, 45, 440, DateTimeKind.Utc).AddTicks(1395));
        }
    }
}
