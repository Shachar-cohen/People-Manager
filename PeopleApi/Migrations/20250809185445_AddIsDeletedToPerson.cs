using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PeopleApi.Migrations
{
    /// <inheritdoc />
    public partial class AddIsDeletedToPerson : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "People",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "People");
        }
    }
}
