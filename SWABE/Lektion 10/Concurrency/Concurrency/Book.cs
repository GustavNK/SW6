using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Concurrency
{
    public class Book
    {
        public int BookId { get; set; }
        public string? Title { get; set; }
        [ConcurrencyCheck]
        public DateTime PublishedOn { get; set; }
        public string Description { get; set; }
        public string? Theme { get; set; }
    }
}
