import {v} from "convex/values"
import {query , mutation} from "./_generated/server"
import {Doc , Id} from "./_generated/dataModel"


export const archive = mutation({
  args: {
    id : v.id("documents")
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if(!identity){
       throw new Error("Not Authenticated")
    }

    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)

    if(!existingDocument){
      throw new Error("Not Found")
    }

    if(existingDocument.userId !== userId){
      throw new Error("Unauthorized")
    }

    const recursiveArchive = async (documentId : Id<"documents">) => {
      const children = await ctx.db
                        .query("documents")
                        .withIndex("by_user_parent" , q => (
                          q
                            .eq("userId" , userId)
                            .eq("parentDocument", documentId)
                        ))
                        .collect()
      
      for(const child of children){
          await ctx.db.patch(child._id , {
            isArchived : true
          })

          await recursiveArchive(child._id)
      }
    } 

    const docuemnts = await ctx.db.patch(args.id , {
      isArchived : true
    })

    recursiveArchive(args.id)
    
    return docuemnts
  },
})

export const getSidebar = query({
  args:{
    parentDocument: v.optional(v.id("documents"))
  },
  handler : async (ctx , args) => {
    const identity = await ctx.auth.getUserIdentity();
      if(!identity){
         throw new Error("Not Authenticated")
      }

      const userId = identity.subject

      const docuemnts = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) => 
          q
            .eq("userId" , userId)
            .eq("parentDocument" , args.parentDocument)
        )
        .filter((q) => 
          q.eq(q.field("isArchived"), false)
        )
        .order("desc")
        .collect()

      return docuemnts
  }
})

export const create = mutation({
  args:{
    title : v.string(),
    parentDocument: v.optional(v.id("documents"))
  } , 
  handler : async (ctx , args) => {
      const identity = await ctx.auth.getUserIdentity();
      if(!identity){
         throw new Error("Not Authenticated")
      }

      const userId = identity.subject

      const document = await ctx.db.insert("documents" , {
        title : args.title,
        parentDocument : args.parentDocument,
        userId : userId,
        isArchived: false,
        isPublished: false
      })

      return document 
  }
})

export const getTrash = query({
  handler : async(ctx) => {
    const identity = await ctx.auth.getUserIdentity();
      if(!identity){
         throw new Error("Not Authenticated")
      }

      const userId = identity.subject

      const docuemnts = await ctx.db
                                  .query("documents")
                                  .withIndex("by_user" , q => q.eq("userId" , userId))
                                  .filter(q => q.eq(q.field("isArchived") , true))
                                  .order("desc")
                                  .collect()
      
      return docuemnts
  }
})

export const restoreTrash = mutation({
  args : {
    id : v.id("documents")
  },
  handler : async (ctx , args) => {
    const identity = await ctx.auth.getUserIdentity();
      if(!identity){
         throw new Error("Not Authenticated")
      }

      const userId = identity.subject

      const existingDocument = await ctx.db.get(args.id)

      if(!existingDocument){
        throw new Error("Not found")
      }

      if(existingDocument.userId !== userId){
        throw new Error("Unauthorized")
      }

      const recursiveRestore = async (docuemntId : Id<"documents">) => {
          const children = await ctx.db.query("documents").withIndex("by_user_parent" , q => 
            q.eq("userId" , userId)
              .eq("parentDocument" , docuemntId)
          ).collect()

          for(const child of children){
              await ctx.db.patch(child._id , {
                isArchived : false
              })

            recursiveRestore(child._id)
          }
      }

      const options : Partial<Doc<"documents">> = {
        isArchived : false
      }

      if(existingDocument.parentDocument){
        const parent = await ctx.db.get(existingDocument.parentDocument)
        if(parent?.isArchived){
          options.parentDocument = undefined
        }
      }

      const docuemnt = await ctx.db.patch(args.id , options)

      recursiveRestore(args.id)

      return docuemnt
  }
})

export const remove = mutation({
  args : {
    id : v.id("documents")
  },
  handler: async (ctx , args) => {
    const identity = await ctx.auth.getUserIdentity();
    if(!identity){
       throw new Error("Not Authenticated")
    }

    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)

    if(!existingDocument){
      throw new Error("Not found")
    }

    if(existingDocument.userId !== userId){
      throw new Error("Unauthorized")
    }

    const document = await ctx.db.delete(args.id)

    return document
  }
})

export const getSearch = query({
  handler : async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if(!identity){
       throw new Error("Not Authenticated")
    }

    const userId = identity.subject

    const docuemnts = await ctx.db.query("documents")
    .withIndex("by_user" , q => q.eq("userId" , userId))
    .filter(q => q.eq(q.field("isArchived" ), false))
    .order('desc')
    .collect()


    return docuemnts

  }
})

export const getById = query({
  args :{ documentId : v.id("documents")},
  handler : async (ctx , agrs) => {
    const identity = await ctx.auth.getUserIdentity();
    
   const document = await ctx.db.get(agrs.documentId)
   
   if(!document) {
    throw new Error("Not found")
   }

   if(!document.isArchived && document.isPublished){
    return document
   }

   if(!identity){
    throw new Error("Not Authenticated")
    }
    const userId = identity.subject

    if(document.userId !== userId){
      throw new Error("Unauthorized")
    }

    return document
  }
})

export const updateDoc = mutation({
  args : {
    id : v.id("documents"),
    title : v.optional(v.string()),
    content : v.optional(v.string()),
    coverImg : v.optional(v.string()),
    icon : v.optional(v.string()),
    isPublished : v.optional(v.boolean())
  },
  handler : async (ctx , args) => {
    const identity = await ctx.auth.getUserIdentity();
    if(!identity){
       throw new Error("Not Authenticated")
    }

    const userId = identity.subject

    const {id , ...rest} = args

    const existingDocument = await ctx.db.get(args.id)

    if(!existingDocument) {
      throw new Error("Not Found")
    }

    if(existingDocument.userId !== userId){
      throw new Error("Unauthorized")
    }

    const document = await ctx.db.patch(args.id , {
      ...rest
    })

    return document
  }
})

export const removeIcon = mutation({
  args : {
    id : v.id("documents")
  },
  handler : async (ctx , args) => {
    const identity = await ctx.auth.getUserIdentity();
    if(!identity){
       throw new Error("Not Authenticated")
    }

    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)

    if(!existingDocument) {
      throw new Error("Not Found")
    }

    if(existingDocument.userId !== userId){
      throw new Error("Unauthorized")
    }

    const document = await ctx.db.patch(args.id , {
      icon : undefined
    })

    return document
  }
})

export const removeCover = mutation({
  args : {
    id : v.id("documents")
  },
  handler : async (ctx , args) => {
    const identity = await ctx.auth.getUserIdentity();
    if(!identity){
       throw new Error("Not Authenticated")
    }

    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)

    if(!existingDocument) {
      throw new Error("Not Found")
    }

    if(existingDocument.userId !== userId){
      throw new Error("Unauthorized")
    }

    const document = await ctx.db.patch(args.id , {
      coverImg : undefined
    })

    return document
  }
})