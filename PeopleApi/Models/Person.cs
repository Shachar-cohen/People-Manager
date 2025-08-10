// Model class that defines the structure of a Person object

using System.ComponentModel.DataAnnotations;

namespace PeopleApi.Models
{
    public class Person
    {
        [Required]
        [RegularExpression(@"^\d{9}$", ErrorMessage = "ID must be exactly 9 digits.")]
        public string Id { get; set; }         

        [Required]
        [MinLength(2, ErrorMessage = "First name must be at least 2 characters.")]
        [MaxLength(50, ErrorMessage = "First name cannot be longer than 50 characters.")]
        [RegularExpression(@"^[A-Za-z\u0590-\u05FF\s'-]+$", ErrorMessage = "First name can only contain letters, spaces.")]
        public string FirstName { get; set; } 

        [Required]
        [MinLength(2, ErrorMessage = "Last name must be at least 2 characters.")]
        [MaxLength(50, ErrorMessage = "Last name cannot be longer than 50 characters.")]
        [RegularExpression(@"^[A-Za-z\u0590-\u05FF\s'-]+$", ErrorMessage = "Last name can only contain letters, spaces.")]
        public string LastName { get; set; }   

        [Required]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [MaxLength(100, ErrorMessage = "Email cannot be longer than 100 characters.")]
        public string Email { get; set; }      

        [Required]
        [RegularExpression(@"^05\d{7,8}$", ErrorMessage = "Phone must start with 05 and be 9–10 digits.")]
        public string Phone { get; set; }

        public bool IsDeleted { get; set; } = false;

    }

}
