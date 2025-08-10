// API controller that handles CRUD operations for "Person" objects.

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PeopleApi.Data;
using PeopleApi.Models;

namespace PeopleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PeopleController : ControllerBase
    {
        private readonly PeopleDbContext _db;

        public PeopleController(PeopleDbContext db)
        {
            _db = db;
        }

        // Retrieves all non-deleted people from the database
        [HttpGet]
        public ActionResult<IEnumerable<Person>> GetPeople()
        {
            var all = _db.People
                         .AsNoTracking()
                         .Where(p => !p.IsDeleted)
                         .ToList();
            return Ok(all);
        }

        // Retrieves a single person by ID (only if not deleted)
        [HttpGet("{id}")]
        public ActionResult<Person> GetById(string id)
        {
            var person = _db.People.AsNoTracking().FirstOrDefault(p => p.Id == id && !p.IsDeleted);
            return person is null ? NotFound(new { message = "Person not found." }) : Ok(person);
        }

        // Adds a new person to the database after validation
        [HttpPost]
        public ActionResult AddPerson([FromBody] Person person)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            // Check for duplicate values before adding
            if (_db.People.Any(p => p.Id == person.Id))
                return BadRequest(new { message = "Person with this ID already exists." });

            if (_db.People.Any(p => p.Email.ToLower() == person.Email.ToLower()))
                return BadRequest(new { message = "Person with this Email already exists." });

            if (_db.People.Any(p => p.Phone == person.Phone))
                return BadRequest(new { message = "Person with this Phone already exists." });

            _db.People.Add(person);
            _db.SaveChanges();

            return CreatedAtAction(nameof(GetById),
                new { id = person.Id },
                new { message = "Person added successfully.", person });
        }

        // (marks person as deleted instead of removing)
        [HttpDelete("{id}")]
        public ActionResult DeletePerson(string id)
        {
            var person = _db.People.FirstOrDefault(p => p.Id == id && !p.IsDeleted);
            if (person == null)
                return NotFound(new { message = "Person not found." });

            person.IsDeleted = true;
            _db.SaveChanges();

            return Ok(new { message = "Person deleted. You can undo this action.", personId = id });
        }

        // Restores a previously soft-deleted person
        [HttpPost("undo/{id}")]
        public ActionResult UndoDelete(string id)
        {
            var person = _db.People.FirstOrDefault(p => p.Id == id && p.IsDeleted);
            if (person == null)
                return NotFound(new { message = "No deleted person found to restore." });

            person.IsDeleted = false;
            _db.SaveChanges();

            return Ok(new { message = "Person restored successfully.", personId = id });
        }

        // Updates an existing person's details
        [HttpPut("{id}")]
        public ActionResult UpdatePerson(string id, [FromBody] Person updated)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            var existing = _db.People.FirstOrDefault(p => p.Id == id && !p.IsDeleted);
            if (existing == null)
                return NotFound(new { message = "Person not found." });

            existing.FirstName = updated.FirstName;
            existing.LastName = updated.LastName;
            existing.Email = updated.Email;
            existing.Phone = updated.Phone;

            _db.SaveChanges();
            return Ok(new { message = "Person updated successfully." });
        }
    }
}