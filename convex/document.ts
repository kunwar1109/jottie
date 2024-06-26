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