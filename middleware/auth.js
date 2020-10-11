User: {
  username: "Sonali";
  firstName: "string";
  lastName: "string";
  email: "string";
  password: "string/number";
  readingList: {
    storyName: {
      id: uuid;
      votes: number;
      comments: [];
      reading: true;
    }
    storyName: {
      id: uuid;

      votes: number;
      comments: [];
      reading: true;
    }
  }
  library: {
    storyName: {
      votes: number;
      comments: ["blah", "pol"];
      reading: false;
    }
  }
  create: {
    storyName: {
      chapters: {
        chapter1: {
          comments: ["shit", "blah"];
        }
        chapter2: {
          comments: ["shit", "blah"];
        }
      }
      votes: number;
      chapterCount: number;
      visibility: public;
    }
  }
  myStories: {
    storyName: {
      chapters: {
        chapter1: {
          partId: number;
          comments: ["shit", "blah"];
        }
        chapter2: {
          partId: number;
          comments: ["shit", "blah"];
        }
      }
      votes: number;
      chapterCount: number;
      visibility: public;
    }
  }
}

Stories: {
  storyName: {
    detail: {
      Name: "string";
      Cover: "";
      tags: ["", ""];
      Genre: ["", ""];
      author: "";
    }
    chapters: {
      chapter1: {
        comments: ["shit", "blah"];
      }
      chapter2: {
        comments: ["shit", "blah"];
      }
    }
    votes: number;
    chapterCount: number;
    visibility: public;
  }
  storyName: {
    chapters: {
      chapter1: {
        comments: ["shit", "blah"];
      }
      chapter2: {
        comments: ["shit", "blah"];
      }
    }
    votes: number;
    chapterCount: number;
    visibility: public;
  }
}
