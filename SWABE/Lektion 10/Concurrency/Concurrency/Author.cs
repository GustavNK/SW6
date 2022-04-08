using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Concurrency
{
    public class Author
    {
        public int AuthorId { get; set; }
        public string Name { get; set; }
        [Timestamp]
        public Byte[] ChangeCheck { get; set; }
    }
}
